import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { searchVideos, getVideoDetails } from '@/lib/youtube'
import { categorizeVideo } from '@/lib/categorizer'
import { ACTIVE_TOPIC } from '@/topic.config'

function getDailyQueries(): string[] {
  const queries = ACTIVE_TOPIC.searchQueries
  const batchSize = 10
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  )
  const start = (dayOfYear * batchSize) % queries.length
  const end = start + batchSize
  return end <= queries.length
    ? queries.slice(start, end)
    : [...queries.slice(start), ...queries.slice(0, end - queries.length)]
}

export async function GET(req: NextRequest) {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 500 })
  }
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const dailyQueries = getDailyQueries()
  let totalAdded = 0

  for (const query of dailyQueries) {
    const jobId = crypto.randomUUID()
    await supabase.from('scan_jobs').insert({
      id: jobId,
      query,
      status: 'running',
      started_at: new Date().toISOString(),
    })

    try {
      const { results } = await searchVideos(query, 25)
      const details = await getVideoDetails(results.map(r => r.youtube_id))
      const detailMap = new Map(details.map(d => [d.youtube_id, d]))

      const { data: categories } = await supabase.from('categories').select('id, slug')
      const categoryMap = new Map(categories?.map(c => [c.slug, c.id]) || [])

      let added = 0
      for (const result of results) {
        const detail = detailMap.get(result.youtube_id)

        const { error: upsertErr, data: upserted } = await supabase
          .from('videos')
          .upsert({
            youtube_id: result.youtube_id,
            title: result.title,
            description: result.description,
            thumbnail_url: result.thumbnail_url,
            channel_name: result.channel_name,
            channel_id: result.channel_id,
            published_at: result.published_at,
            duration_seconds: detail?.duration_seconds ?? null,
            view_count: detail?.view_count ?? null,
            tags: detail?.tags ?? [],
          }, { onConflict: 'youtube_id', ignoreDuplicates: false })
          .select('id')
          .single()

        if (upsertErr || !upserted) continue
        added++

        const cats = categorizeVideo(
          result.title,
          result.description,
          detail?.tags || [],
          detail?.duration_seconds || 0,
          ACTIVE_TOPIC
        )

        const allSlugs = [...cats.slugs, ...(cats.durationSlug ? [cats.durationSlug] : [])]
        const categoryRows = allSlugs
          .map(slug => categoryMap.get(slug))
          .filter(Boolean)
          .map(categoryId => ({ video_id: upserted.id, category_id: categoryId, auto_tagged: true }))

        if (categoryRows.length > 0) {
          await supabase.from('video_categories').upsert(categoryRows, {
            onConflict: 'video_id,category_id',
            ignoreDuplicates: true,
          })
        }
      }

      totalAdded += added
      await supabase.from('scan_jobs').update({
        status: 'completed',
        videos_found: added,
        completed_at: new Date().toISOString(),
      }).eq('id', jobId)
    } catch {
      await supabase.from('scan_jobs').update({
        status: 'failed',
        completed_at: new Date().toISOString(),
      }).eq('id', jobId)
    }
  }

  return NextResponse.json({ added: totalAdded, queries: dailyQueries.length })
}

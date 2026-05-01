import { createClient } from '@supabase/supabase-js'
import { searchVideos, getVideoDetails } from '../lib/youtube'
import { categorizeVideo } from '../lib/categorizer'
import { ACTIVE_TOPIC } from '../topic.config'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seed() {
  console.log(`\nSeeding "${ACTIVE_TOPIC.name}" — ${ACTIVE_TOPIC.searchQueries.length} queries`)

  const { data: categories } = await supabase.from('categories').select('id, slug')
  const categoryMap = new Map(categories?.map(c => [c.slug, c.id]) || [])

  let totalAdded = 0

  for (const query of ACTIVE_TOPIC.searchQueries) {
    process.stdout.write(`  Searching "${query}"... `)
    let pageToken: string | undefined

    for (let page = 0; page < 2; page++) {
      const { results, nextPageToken } = await searchVideos(query, 50, pageToken)
      if (results.length === 0) break

      const details = await getVideoDetails(results.map(r => r.youtube_id))
      const detailMap = new Map(details.map(d => [d.youtube_id, d]))

      for (const result of results) {
        const detail = detailMap.get(result.youtube_id)

        const { error, data: upserted } = await supabase
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
          }, { onConflict: 'youtube_id', ignoreDuplicates: true })
          .select('id')
          .single()

        if (error || !upserted) continue

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
        totalAdded++
      }

      pageToken = nextPageToken
      if (!pageToken) break
      await new Promise(r => setTimeout(r, 1000))
    }

    console.log(`done (total: ${totalAdded})`)
    await new Promise(r => setTimeout(r, 500))
  }

  console.log(`\nSeed complete. Added ${totalAdded} videos.`)
}

seed().catch(console.error)

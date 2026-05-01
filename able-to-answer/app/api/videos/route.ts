import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const q = searchParams.get('q')
  const duration = searchParams.get('duration')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '24')
  const offset = (page - 1) * limit

  const supabase = createAdminClient()

  let query = supabase
    .from('videos')
    .select(`
      *,
      video_categories(
        categories(id, name, slug, icon, color)
      )
    `, { count: 'exact' })
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (q) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
  }

  if (duration === 'quick') {
    query = query.lt('duration_seconds', 300)
  } else if (duration === 'deep') {
    query = query.gte('duration_seconds', 1800)
  }

  if (category) {
    const { data: catData } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single()

    if (catData) {
      const { data: videoIds } = await supabase
        .from('video_categories')
        .select('video_id')
        .eq('category_id', catData.id)

      if (videoIds) {
        query = query.in('id', videoIds.map(r => r.video_id))
      }
    }
  }

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ videos: data, total: count, page, limit })
}

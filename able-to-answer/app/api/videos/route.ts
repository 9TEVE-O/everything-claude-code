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

  const SELECT_FRAGMENT = `
    *,
    video_categories(
      categories(id, name, slug, icon, color)
    )
  `

  const applyFilters = (q: any) => {
    let query = q
    if (searchParams.get('q')) {
      query = query.or(`title.ilike.%${searchParams.get('q')}%,description.ilike.%${searchParams.get('q')}%`)
    }
    if (duration === 'quick') query = query.lt('duration_seconds', 300)
    else if (duration === 'deep') query = query.gte('duration_seconds', 1800)
    return query
  }

  if (category) {
    const { data: catData } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single()

    if (!catData) {
      return NextResponse.json({ videos: [], total: 0, page, limit })
    }

    // Use !inner join to filter by category — no IN list, no URL length limits
    let query = supabase
      .from('videos')
      .select(`*, video_categories!inner(categories(id, name, slug, icon, color))`, { count: 'exact' })
      .eq('video_categories.category_id', catData.id)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)

    query = applyFilters(query)
    const { data, error, count } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ videos: data, total: count, page, limit })
  }

  let query = supabase
    .from('videos')
    .select(SELECT_FRAGMENT, { count: 'exact' })
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

  query = applyFilters(query)
  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ videos: data, total: count, page, limit })
}

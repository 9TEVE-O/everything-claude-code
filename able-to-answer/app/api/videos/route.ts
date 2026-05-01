import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const q = searchParams.get('q')         // search string
  const duration = searchParams.get('duration')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '24')
  const offset = (page - 1) * limit

  const supabase = createAdminClient()

  // Applies search-string and duration filters to any Supabase query builder
  const applyFilters = (builder: any) => {
    if (q) builder = builder.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
    if (duration === 'quick') builder = builder.lt('duration_seconds', 300)
    else if (duration === 'deep') builder = builder.gte('duration_seconds', 1800)
    return builder
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

    // !inner join — filters by category in one round-trip with no IN list
    let builder = supabase
      .from('videos')
      .select(`*, video_categories!inner(categories(id, name, slug, icon, color))`, { count: 'exact' })
      .eq('video_categories.category_id', catData.id)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)

    builder = applyFilters(builder)
    const { data, error, count } = await builder
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ videos: data, total: count, page, limit })
  }

  let builder = supabase
    .from('videos')
    .select(`*, video_categories(categories(id, name, slug, icon, color))`, { count: 'exact' })
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

  builder = applyFilters(builder)
  const { data, error, count } = await builder
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ videos: data, total: count, page, limit })
}

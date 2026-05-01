import { createAdminClient } from './supabase'

export async function getVideos(params: {
  q?: string
  category?: string
  duration?: string
  page?: number
  limit?: number
}) {
  const { q, category, duration, page = 1, limit = 24 } = params
  const offset = (page - 1) * limit
  const supabase = createAdminClient()

  const applyFilters = (query: any) => {
    if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
    if (duration === 'quick') query = query.lt('duration_seconds', 300)
    else if (duration === 'deep') query = query.gte('duration_seconds', 1800)
    return query
  }

  if (category) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single()

    if (!cat) return { videos: [], total: 0 }

    let query = supabase
      .from('videos')
      .select(`*, video_categories!inner(categories(id, name, slug, icon, color))`, { count: 'exact' })
      .eq('video_categories.category_id', cat.id)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)

    query = applyFilters(query)
    const { data, error, count } = await query
    if (error) throw error
    return { videos: data || [], total: count || 0 }
  }

  let query = supabase
    .from('videos')
    .select(`*, video_categories(categories(id, name, slug, icon, color))`, { count: 'exact' })
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

  query = applyFilters(query)
  const { data, error, count } = await query
  if (error) throw error
  return { videos: data || [], total: count || 0 }
}

export async function getCategories() {
  const supabase = createAdminClient()
  const { data } = await supabase.from('categories').select('*').order('name')
  return data || []
}

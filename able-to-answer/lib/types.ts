export interface Video {
  id: string
  youtube_id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  channel_name: string | null
  channel_id: string | null
  duration_seconds: number | null
  published_at: string | null
  view_count: number | null
  tags: string[] | null
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
}

export interface VideoWithCategories extends Video {
  categories: Category[]
}

export interface ExtractedSkill {
  id: string
  video_id: string
  name: string
  description: string
  steps: string[] | null
  source_timestamp: string | null
  created_at: string
}

export interface ScanJob {
  id: string
  query: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  videos_found: number | null
  started_at: string | null
  completed_at: string | null
}

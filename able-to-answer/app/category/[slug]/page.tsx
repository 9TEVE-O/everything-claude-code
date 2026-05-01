import { createAdminClient } from '@/lib/supabase'
import { VideoCard } from '@/components/VideoCard'
import { notFound } from 'next/navigation'

interface Props { params: { slug: string } }

export default async function CategoryPage({ params }: Props) {
  const supabase = createAdminClient()

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!category) notFound()

  const { data: videoCategories } = await supabase
    .from('video_categories')
    .select('videos(*, video_categories(categories(*)))')
    .eq('category_id', category.id)
    .limit(48)

  const videos = videoCategories?.map((vc: any) => vc.videos).filter(Boolean) || []

  return (
    <div className="space-y-6">
      <div>
        <div className="text-4xl mb-3">{category.icon}</div>
        <h1 className="text-3xl font-bold">{category.name}</h1>
        <p className="text-gray-400 mt-2">{category.description}</p>
        <p className="text-sm text-gray-500 mt-1">{videos.length} videos</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {videos.map((video: any) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  )
}

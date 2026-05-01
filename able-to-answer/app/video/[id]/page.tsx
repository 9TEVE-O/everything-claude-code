import { createAdminClient } from '@/lib/supabase'
import { VideoPlayer } from '@/components/VideoPlayer'
import { notFound } from 'next/navigation'

interface Props { params: { id: string } }

export default async function VideoPage({ params }: Props) {
  const supabase = createAdminClient()

  const { data: video } = await supabase
    .from('videos')
    .select('*, video_categories(categories(*))')
    .eq('id', params.id)
    .single()

  if (!video) notFound()

  const { data: skills } = await supabase
    .from('extracted_skills')
    .select('*')
    .eq('video_id', params.id)

  const categories = video.video_categories?.map((vc: any) => vc.categories).filter(Boolean) || []

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <VideoPlayer youtubeId={video.youtube_id} title={video.title} />

      <div>
        <h1 className="text-2xl font-bold">{video.title}</h1>
        <p className="text-gray-400 mt-1">{video.channel_name}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat: any) => (
          <a
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="text-sm px-3 py-1 rounded-full border border-gray-700 text-gray-300 hover:border-orange-500 hover:text-orange-400 transition-colors"
          >
            {cat.icon} {cat.name}
          </a>
        ))}
      </div>

      <a
        href={`https://www.youtube.com/watch?v=${video.youtube_id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
      >
        ▶ Watch on YouTube — support the creator
      </a>

      {video.description && (
        <div className="bg-gray-900 rounded-xl p-4 text-sm text-gray-400 whitespace-pre-line">
          {video.description}
        </div>
      )}

      {skills && skills.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Skills Taught in This Video</h2>
          <div className="space-y-3">
            {skills.map((skill: any) => (
              <div key={skill.id} className="bg-gray-900 rounded-xl p-4">
                <h3 className="font-medium text-orange-400">{skill.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{skill.description}</p>
                {skill.steps?.length > 0 && (
                  <ol className="mt-2 space-y-1">
                    {skill.steps.map((step: string, i: number) => (
                      <li key={i} className="text-sm text-gray-300">{step}</li>
                    ))}
                  </ol>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

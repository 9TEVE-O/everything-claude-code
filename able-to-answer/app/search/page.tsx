import { VideoCard } from '@/components/VideoCard'
import { SearchBar } from '@/components/SearchBar'

const BASE = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

interface Props { searchParams: { q?: string } }

async function searchVideos(q: string) {
  try {
    const res = await fetch(`${BASE}/api/videos?q=${encodeURIComponent(q)}&limit=48`, { cache: 'no-store' })
    if (!res.ok) return { videos: [], total: 0 }
    return res.json()
  } catch {
    return { videos: [], total: 0 }
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const q = searchParams.q || ''
  const { videos, total } = q ? await searchVideos(q) : { videos: [], total: 0 }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Search</h1>
      <SearchBar initialValue={q} />

      {q && (
        <p className="text-gray-400">
          {total} results for <span className="text-white font-medium">&ldquo;{q}&rdquo;</span>
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {videos.map((video: any) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  )
}

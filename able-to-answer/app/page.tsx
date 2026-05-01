import { CategoryGrid } from '@/components/CategoryGrid'
import { VideoCard } from '@/components/VideoCard'
import { ACTIVE_TOPIC } from '@/topic.config'

const BASE = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

async function getRecentVideos() {
  try {
    const res = await fetch(`${BASE}/api/videos?limit=12`, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    return (await res.json()).videos || []
  } catch {
    return []
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${BASE}/api/categories`, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    return (await res.json()).categories || []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [videos, categories] = await Promise.all([getRecentVideos(), getCategories()])

  return (
    <div className="space-y-12">
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
          {ACTIVE_TOPIC.name}
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">{ACTIVE_TOPIC.description}</p>
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="/browse"
            className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-semibold transition-colors"
          >
            Browse Videos
          </a>
          <a
            href="/chat"
            className="px-6 py-3 rounded-xl border border-gray-700 hover:border-orange-500 text-white font-semibold transition-colors"
          >
            Ask AI Assistant
          </a>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Browse by Category</h2>
        <CategoryGrid categories={categories} />
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Recently Added</h2>
          <a href="/browse" className="text-orange-400 hover:text-orange-300 text-sm">View all →</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((video: any) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>
    </div>
  )
}

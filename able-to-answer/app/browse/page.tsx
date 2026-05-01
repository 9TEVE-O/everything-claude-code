import { VideoCard } from '@/components/VideoCard'
import { SearchBar } from '@/components/SearchBar'
import { getVideos, getCategories } from '@/lib/data'

interface Props {
  searchParams: { q?: string; category?: string; duration?: string; page?: string }
}

export default async function BrowsePage({ searchParams }: Props) {
  const [{ videos, total }, categories] = await Promise.all([
    getVideos({
      q: searchParams.q,
      category: searchParams.category,
      duration: searchParams.duration,
      page: searchParams.page ? parseInt(searchParams.page) : 1,
      limit: 24,
    }),
    getCategories(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">Browse All Videos</h1>
        <SearchBar initialValue={searchParams.q} />
      </div>

      <div className="flex gap-8">
        <aside className="w-52 shrink-0 space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Duration</h3>
            <div className="space-y-1">
              {[
                { label: 'All', value: '' },
                { label: '< 5 min (Quick)', value: 'quick' },
                { label: '> 30 min (Deep)', value: 'deep' },
              ].map(opt => (
                <a
                  key={opt.value}
                  href={`/browse?${new URLSearchParams({ ...searchParams, duration: opt.value })}`}
                  className={`block px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    (searchParams.duration || '') === opt.value
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {opt.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Category</h3>
            <div className="space-y-1">
              <a
                href="/browse"
                className={`block px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  !searchParams.category ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                All
              </a>
              {categories.map((cat: any) => (
                <a
                  key={cat.id}
                  href={`/browse?category=${cat.slug}`}
                  className={`block px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    searchParams.category === cat.slug
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {cat.icon} {cat.name}
                </a>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-4">{(total || 0).toLocaleString()} videos</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video: any) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

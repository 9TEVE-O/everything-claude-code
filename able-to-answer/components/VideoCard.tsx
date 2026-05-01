import Image from 'next/image'
import Link from 'next/link'

function formatDuration(seconds: number | null): string {
  if (!seconds) return ''
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
}

function durationBadgeClass(seconds: number | null): string {
  if (!seconds) return 'bg-gray-800 text-gray-400'
  if (seconds < 300) return 'bg-green-900 text-green-300'
  if (seconds >= 1800) return 'bg-purple-900 text-purple-300'
  return 'bg-gray-800 text-gray-400'
}

export function VideoCard({ video }: { video: any }) {
  const categories = video.video_categories?.map((vc: any) => vc.categories).filter(Boolean) || []

  return (
    <Link
      href={`/video/${video.id}`}
      className="group block rounded-xl overflow-hidden bg-gray-900 hover:bg-gray-800 transition-colors"
    >
      <div className="relative aspect-video bg-gray-800">
        {video.thumbnail_url && (
          <Image
            src={video.thumbnail_url}
            alt={video.title || ''}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        )}
        {video.duration_seconds && (
          <span className={`absolute bottom-2 right-2 text-xs px-1.5 py-0.5 rounded font-medium ${durationBadgeClass(video.duration_seconds)}`}>
            {formatDuration(video.duration_seconds)}
          </span>
        )}
      </div>
      <div className="p-3 space-y-2">
        <h3 className="text-sm font-medium line-clamp-2 group-hover:text-orange-400 transition-colors">
          {video.title}
        </h3>
        <p className="text-xs text-gray-500">{video.channel_name}</p>
        <div className="flex flex-wrap gap-1">
          {categories.slice(0, 3).map((cat: any) => (
            <span
              key={cat.id}
              className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700"
            >
              {cat.icon} {cat.name}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'

export interface YouTubeSearchResult {
  youtube_id: string
  title: string
  description: string
  thumbnail_url: string
  channel_name: string
  channel_id: string
  published_at: string
}

export interface YouTubeVideoDetails {
  youtube_id: string
  duration_seconds: number
  view_count: number
  tags: string[]
}

function iso8601ToSeconds(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  return (parseInt(match[1] || '0') * 3600) + (parseInt(match[2] || '0') * 60) + parseInt(match[3] || '0')
}

export async function searchVideos(
  query: string,
  maxResults = 50,
  pageToken?: string
): Promise<{ results: YouTubeSearchResult[]; nextPageToken?: string }> {
  const params = new URLSearchParams({
    key: process.env.YOUTUBE_API_KEY!,
    q: query,
    type: 'video',
    part: 'snippet',
    maxResults: String(maxResults),
    relevanceLanguage: 'en',
    ...(pageToken ? { pageToken } : {}),
  })

  const res = await fetch(`${YOUTUBE_API_BASE}/search?${params}`)
  if (!res.ok) throw new Error(`YouTube search failed: ${res.status} ${res.statusText}`)
  const data = await res.json()

  return {
    results: (data.items || []).map((item: any) => ({
      youtube_id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail_url: item.snippet.thumbnails?.high?.url ?? item.snippet.thumbnails?.default?.url,
      channel_name: item.snippet.channelTitle,
      channel_id: item.snippet.channelId,
      published_at: item.snippet.publishedAt,
    })),
    nextPageToken: data.nextPageToken,
  }
}

export async function getVideoDetails(youtubeIds: string[]): Promise<YouTubeVideoDetails[]> {
  if (youtubeIds.length === 0) return []

  const results: YouTubeVideoDetails[] = []
  for (let i = 0; i < youtubeIds.length; i += 50) {
    const chunk = youtubeIds.slice(i, i + 50)
    const params = new URLSearchParams({
      key: process.env.YOUTUBE_API_KEY!,
      id: chunk.join(','),
      part: 'contentDetails,statistics,snippet',
    })
    const res = await fetch(`${YOUTUBE_API_BASE}/videos?${params}`)
    if (!res.ok) continue
    const data = await res.json()

    for (const item of data.items || []) {
      results.push({
        youtube_id: item.id,
        duration_seconds: iso8601ToSeconds(item.contentDetails.duration),
        view_count: parseInt(item.statistics.viewCount || '0'),
        tags: item.snippet.tags || [],
      })
    }
  }
  return results
}

export async function getChannelUploads(channelId: string, maxResults = 50): Promise<YouTubeSearchResult[]> {
  const channelParams = new URLSearchParams({
    key: process.env.YOUTUBE_API_KEY!,
    id: channelId,
    part: 'contentDetails',
  })
  const channelRes = await fetch(`${YOUTUBE_API_BASE}/channels?${channelParams}`)
  if (!channelRes.ok) return []
  const channelData = await channelRes.json()

  const uploadsPlaylistId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
  if (!uploadsPlaylistId) return []

  const playlistParams = new URLSearchParams({
    key: process.env.YOUTUBE_API_KEY!,
    playlistId: uploadsPlaylistId,
    part: 'snippet',
    maxResults: String(maxResults),
  })
  const playlistRes = await fetch(`${YOUTUBE_API_BASE}/playlistItems?${playlistParams}`)
  if (!playlistRes.ok) return []
  const playlistData = await playlistRes.json()

  return (playlistData.items || []).map((item: any) => ({
    youtube_id: item.snippet.resourceId.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail_url: item.snippet.thumbnails?.high?.url,
    channel_name: item.snippet.channelTitle,
    channel_id: item.snippet.channelId,
    published_at: item.snippet.publishedAt,
  }))
}

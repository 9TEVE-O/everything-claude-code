import { YoutubeTranscript } from 'youtube-transcript'

export async function fetchTranscript(youtubeId: string): Promise<string | null> {
  try {
    const lines = await YoutubeTranscript.fetchTranscript(youtubeId)
    return lines.map((l: any) => l.text).join(' ')
  } catch {
    return null
  }
}

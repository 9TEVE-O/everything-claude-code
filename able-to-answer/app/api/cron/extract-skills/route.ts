import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { fetchTranscript } from '@/lib/transcript'
import { extractSkillsFromTranscript } from '@/lib/skill-extractor'
import { ACTIVE_TOPIC } from '@/topic.config'

export async function POST(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  // Fetch videos not yet processed for skill extraction
  const { data: processed } = await supabase
    .from('extracted_skills')
    .select('video_id')

  const processedIds = [...new Set((processed || []).map(r => r.video_id))]

  const videosQuery = supabase
    .from('videos')
    .select('id, youtube_id, title')
    .limit(5) // 5 per run keeps Claude API costs minimal

  if (processedIds.length > 0) {
    videosQuery.not('id', 'in', `(${processedIds.join(',')})`)
  }

  const { data: videos } = await videosQuery

  if (!videos || videos.length === 0) {
    return NextResponse.json({ message: 'No videos to process' })
  }

  let skillsExtracted = 0
  for (const video of videos) {
    const transcript = await fetchTranscript(video.youtube_id)
    if (!transcript) continue

    const skills = await extractSkillsFromTranscript(transcript, video.title, ACTIVE_TOPIC.name)
    if (skills.length === 0) continue

    await supabase.from('extracted_skills').insert(
      skills.map(s => ({
        id: crypto.randomUUID(),
        video_id: video.id,
        name: s.name,
        description: s.description,
        steps: s.steps,
      }))
    )
    skillsExtracted += skills.length
  }

  return NextResponse.json({ processed: videos.length, skillsExtracted })
}

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { fetchTranscript } from '@/lib/transcript'
import { extractSkillsFromTranscript } from '@/lib/skill-extractor'
import { ACTIVE_TOPIC } from '@/topic.config'

const BATCH_SIZE = 10

export async function GET(req: NextRequest) {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 500 })
  }
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  const { data: videos } = await supabase
    .from('videos')
    .select('id, youtube_id, title')
    .is('skills_attempted_at', null)
    .limit(BATCH_SIZE)

  if (!videos || videos.length === 0) {
    return NextResponse.json({ message: 'No videos to process' })
  }

  // Mark all as attempted immediately — prevents re-picking if transcript unavailable
  await supabase
    .from('videos')
    .update({ skills_attempted_at: new Date().toISOString() })
    .in('id', videos.map(v => v.id))

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

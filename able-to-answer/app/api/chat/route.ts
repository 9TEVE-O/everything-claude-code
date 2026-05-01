import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createAdminClient } from '@/lib/supabase'
import { ACTIVE_TOPIC } from '@/topic.config'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  const { message, history = [] } = await req.json()

  const supabase = createAdminClient()

  // Retrieve relevant skills from the knowledge base via keyword matching
  const keywords = message.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3)
  const orFilter = keywords
    .slice(0, 5) // cap to avoid overly complex queries
    .map((kw: string) => `name.ilike.%${kw}%,description.ilike.%${kw}%`)
    .join(',')

  const { data: skills } = orFilter
    ? await supabase
        .from('extracted_skills')
        .select('name, description, steps, videos(title, youtube_id)')
        .or(orFilter)
        .limit(8)
    : { data: [] }

  const knowledgeContext =
    skills && skills.length > 0
      ? `Knowledge from ${ACTIVE_TOPIC.name} tutorials:\n\n` +
        skills
          .map(
            (s: any) =>
              `**${s.name}** (from "${s.videos?.title}", https://youtu.be/${s.videos?.youtube_id})\n` +
              `${s.description}\n` +
              (s.steps?.length ? `Steps: ${s.steps.join(' | ')}` : '')
          )
          .join('\n\n')
      : ''

  const systemPrompt = [
    `You are an expert ${ACTIVE_TOPIC.name} assistant helping music producers.`,
    `You answer questions about ${ACTIVE_TOPIC.name} based on real YouTube tutorial content.`,
    knowledgeContext
      ? `Use this extracted knowledge from our tutorial library:\n\n${knowledgeContext}\n\nAlways cite the source video and include the YouTube link when referencing it.`
      : `Answer from your general knowledge. Be practical and concise.`,
    'Keep responses focused, friendly, and actionable.',
  ]
    .filter(Boolean)
    .join('\n\n')

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      ...history.map((m: any) => ({ role: m.role, content: m.content })),
      { role: 'user' as const, content: message },
    ],
  })

  const reply = response.content[0].type === 'text' ? response.content[0].text : ''
  return NextResponse.json({ reply })
}

import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export interface ExtractedSkillData {
  name: string
  description: string
  steps: string[]
}

export async function extractSkillsFromTranscript(
  transcript: string,
  videoTitle: string,
  topicName: string
): Promise<ExtractedSkillData[]> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: `You extract teachable skills from ${topicName} tutorial video transcripts. Respond only with valid JSON.`,
    messages: [
      {
        role: 'user',
        content: `Video title: "${videoTitle}"

Transcript (first 8000 chars):
${transcript.slice(0, 8000)}

Extract all distinct skills, techniques, or concepts taught. For each:
- name: short skill name (3-8 words)
- description: what it is and why it matters (1-2 sentences)
- steps: array of numbered steps to perform it (2-6 steps)

Respond with a JSON array: [{"name": "...", "description": "...", "steps": ["1. ...", "2. ..."]}]`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  try {
    const match = text.match(/\[[\s\S]*\]/)
    if (!match) return []
    return JSON.parse(match[0]) as ExtractedSkillData[]
  } catch {
    return []
  }
}

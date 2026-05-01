import type { TopicConfig } from '../topic.config'

export interface CategorizationResult {
  slugs: string[]
  durationSlug: 'quick-hits' | 'deep-dives' | null
}

export function categorizeVideo(
  title: string,
  description: string,
  tags: string[],
  durationSeconds: number,
  config: TopicConfig
): CategorizationResult {
  const text = [title, description, ...tags].join(' ').toLowerCase()

  const slugs: string[] = []
  for (const [slug, keywords] of Object.entries(config.categoryRules)) {
    if (keywords.some(kw => text.includes(kw))) {
      slugs.push(slug)
    }
  }

  let durationSlug: CategorizationResult['durationSlug'] = null
  if (durationSeconds > 0 && durationSeconds < config.durationCategories.quickHit) {
    durationSlug = 'quick-hits'
  } else if (durationSeconds >= config.durationCategories.deepDive) {
    durationSlug = 'deep-dives'
  }

  return { slugs, durationSlug }
}

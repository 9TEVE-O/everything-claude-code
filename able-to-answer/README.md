# Able-to-Answer

Every Ableton Live tutorial, interview, and session on YouTube — auto-categorized, searchable, and compiled into one hub. Creators still get all their views, likes, and revenue because videos play directly on YouTube.

## Features

- **Video Hub** — Thousands of Ableton videos organized into 10 categories
- **Auto-Categorization** — Rule-based keyword + duration engine tags every video on ingest
- **Daily Scanner** — Vercel Cron scans YouTube every day for new content
- **AI Skill Extraction** — Claude reads video transcripts and extracts teachable skills
- **AI Chatbot** — Ask anything; answers come from real tutorial transcripts
- **Optional Accounts** — Save favorites and build watchlists (powered by Supabase Auth)
- **Multi-Topic Ready** — Swap `topic.config.ts` to build a hub for any subject (FL Studio, Logic, etc.)

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 + Tailwind CSS |
| Backend | Next.js API Routes (Vercel serverless) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| YouTube | YouTube Data API v3 |
| AI | Anthropic Claude (claude-sonnet-4-6) |
| Scheduler | Vercel Cron Jobs |
| Deployment | Vercel |

## Setup

### 1. Clone and install

```bash
cd able-to-answer
npm install
```

### 2. Get a YouTube Data API key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project → Enable **YouTube Data API v3**
3. Credentials → Create API Key → restrict to YouTube Data API v3
4. Copy the key

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run `database/migrations/001_initial_schema.sql` in the SQL editor
3. Copy your project URL and keys from Settings → API

### 4. Configure environment

```bash
cp .env.example .env.local
# Fill in all values
```

### 5. Seed the database

```bash
npm run seed
# This runs ~25 YouTube searches and stores every Ableton video it finds
```

### 6. Run locally

```bash
npm run dev
# Open http://localhost:3000
```

### 7. Deploy to Vercel

```bash
npx vercel
# Add env vars in Vercel dashboard
# Cron jobs auto-activate from vercel.json
```

## Adapting for Another Topic

Edit `topic.config.ts` — change the search queries, category rules, and known channels:

```ts
export const FL_STUDIO_CONFIG: TopicConfig = {
  id: 'fl-studio',
  name: 'FL Answer',
  description: 'Every FL Studio tutorial on YouTube',
  searchQueries: ['FL Studio tutorial', 'FL Studio tips', ...],
  categoryRules: { ... },
  // ...
}

export const ACTIVE_TOPIC = FL_STUDIO_CONFIG
```

No other code changes required.

## How the AI Chatbot Works

1. **Scan** — `/api/cron/scan` searches YouTube daily and stores video metadata
2. **Extract** — `/api/cron/extract-skills` fetches transcripts and asks Claude to extract skills
3. **Chat** — `/api/chat` retrieves relevant skills by keyword, then passes them to Claude as context
4. **Cite** — Claude always links back to the source YouTube video

## Categories

| Category | What’s in it |
|----------|-------------|
| Tips & Tricks | Shortcuts, hacks, workflow optimizations |
| Mixing & Mastering | EQ, compression, levels, loudness |
| Plugins & Instruments | Wavetable, Operator, Max for Live, VSTs |
| Interviews & Process | Producer interviews, behind-the-scenes |
| Beginner Guides | Getting started, fundamentals |
| Advanced Techniques | Deep dives for experienced producers |
| Live Performance | Performing live with Ableton |
| Sampling & Arrangement | Sampling, chopping, loops |
| Quick Hits | Under 5 minutes |
| Deep Dives | Over 30 minutes |

-- Able-to-Answer: Initial Schema
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  youtube_id text UNIQUE NOT NULL,
  title text,
  description text,
  thumbnail_url text,
  channel_name text,
  channel_id text,
  duration_seconds integer,
  published_at timestamptz,
  view_count bigint,
  tags text[],
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text,
  color text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS video_categories (
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  auto_tagged boolean DEFAULT true,
  PRIMARY KEY (video_id, category_id)
);

CREATE TABLE IF NOT EXISTS channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  youtube_channel_id text UNIQUE NOT NULL,
  name text,
  last_scanned_at timestamptz
);

CREATE TABLE IF NOT EXISTS scan_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query text,
  status text DEFAULT 'pending',
  videos_found integer,
  started_at timestamptz,
  completed_at timestamptz
);

CREATE TABLE IF NOT EXISTS extracted_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  steps text[],
  source_timestamp text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_favorites (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, video_id)
);

CREATE TABLE IF NOT EXISTS watchlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS watchlist_videos (
  watchlist_id uuid REFERENCES watchlists(id) ON DELETE CASCADE,
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE,
  position integer DEFAULT 0,
  PRIMARY KEY (watchlist_id, video_id)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_videos_published_at ON videos(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_channel_id ON videos(channel_id);
CREATE INDEX IF NOT EXISTS idx_video_categories_category_id ON video_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_extracted_skills_video_id ON extracted_skills(video_id);

-- Seed categories
INSERT INTO categories (name, slug, description, icon, color) VALUES
  ('Tips & Tricks',          'tips-tricks',       'Shortcuts, hacks, and workflow optimizations',        '⚡', '#f97316'),
  ('Mixing & Mastering',     'mixing-mastering',  'EQ, compression, levels, and final mix',             '🎛️', '#8b5cf6'),
  ('Plugins & Instruments',  'plugins-instruments','Wavetable, Operator, Max for Live, VSTs',            '🔌', '#06b6d4'),
  ('Interviews & Process',   'interviews',        'Producer interviews and behind-the-scenes',          '🎤', '#10b981'),
  ('Beginner Guides',        'beginner',          'Getting started and fundamentals',                   '🌱', '#84cc16'),
  ('Advanced Techniques',    'advanced',          'Deep dives for experienced producers',               '🔬', '#f43f5e'),
  ('Live Performance',       'live-performance',  'Performing live with Ableton',                       '🎸', '#eab308'),
  ('Sampling & Arrangement', 'sampling',          'Sampling, chopping, loops, and arranging',           '✂️', '#ec4899'),
  ('Quick Hits',             'quick-hits',        'Under 5 minutes',                                    '⏱️', '#64748b'),
  ('Deep Dives',             'deep-dives',        'Over 30 minutes of in-depth content',                '🐇', '#374151')
ON CONFLICT (slug) DO NOTHING;

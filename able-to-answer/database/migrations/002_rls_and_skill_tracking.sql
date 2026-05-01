-- Migration 002: RLS policies + skill attempt tracking

-- Track skill extraction attempts on videos to avoid reprocessing
ALTER TABLE videos ADD COLUMN IF NOT EXISTS skills_attempted_at timestamptz;

-- Public read access for content tables (videos are public, no login required to browse)
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY videos_public_read ON videos FOR SELECT USING (true);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY categories_public_read ON categories FOR SELECT USING (true);

ALTER TABLE video_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY video_categories_public_read ON video_categories FOR SELECT USING (true);

ALTER TABLE extracted_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY extracted_skills_public_read ON extracted_skills FOR SELECT USING (true);

-- Service role bypass for cron writes (INSERT/UPDATE/DELETE via service role key)
-- The admin client uses SUPABASE_SERVICE_ROLE_KEY which bypasses RLS by default.
-- These policies just make intent explicit for anon/authenticated reads.

-- User-owned tables: strict ownership enforcement
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_favorites_select_own
  ON user_favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY user_favorites_insert_own
  ON user_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_favorites_delete_own
  ON user_favorites FOR DELETE
  USING (auth.uid() = user_id);


ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY watchlists_all_own
  ON watchlists FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


ALTER TABLE watchlist_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY watchlist_videos_all_own
  ON watchlist_videos FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM watchlists w
      WHERE w.id = watchlist_videos.watchlist_id
        AND w.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM watchlists w
      WHERE w.id = watchlist_videos.watchlist_id
        AND w.user_id = auth.uid()
    )
  );

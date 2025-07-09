-- Fix videos table RLS policies for proper deletion and performance
-- First, let's check if the videos table has RLS enabled
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to recreate them
DROP POLICY IF EXISTS "videos_select" ON videos;
DROP POLICY IF EXISTS "videos_insert" ON videos;
DROP POLICY IF EXISTS "videos_update" ON videos;
DROP POLICY IF EXISTS "videos_delete" ON videos;

-- Create optimized RLS policies for videos table
CREATE POLICY "videos_select" ON videos
  FOR SELECT USING (visibility = 'public' OR auth.uid() = creator_id);

CREATE POLICY "videos_insert" ON videos
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "videos_update" ON videos
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "videos_delete" ON videos
  FOR DELETE USING (auth.uid() = creator_id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_videos_creator_id ON videos(creator_id);
CREATE INDEX IF NOT EXISTS idx_videos_visibility ON videos(visibility);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);
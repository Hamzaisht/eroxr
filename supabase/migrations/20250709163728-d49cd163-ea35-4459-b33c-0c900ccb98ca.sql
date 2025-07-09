-- Create view tracking system for anti-manipulation
CREATE TABLE IF NOT EXISTS view_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL,
  content_type TEXT NOT NULL, -- 'post', 'video', 'dating_ad', 'profile', etc.
  viewer_fingerprint TEXT NOT NULL, -- device fingerprint or user_id
  viewer_ip TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE view_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can insert view tracking"
ON view_tracking FOR INSERT
TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "Users can view their own tracking"
ON view_tracking FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR auth.uid() IS NULL);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_view_tracking_content ON view_tracking(content_id, content_type);
CREATE INDEX IF NOT EXISTS idx_view_tracking_fingerprint_time ON view_tracking(viewer_fingerprint, viewed_at);

-- Create function to get view count for content
CREATE OR REPLACE FUNCTION get_content_view_count(
  p_content_id UUID,
  p_content_type TEXT
) RETURNS INTEGER
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT COUNT(DISTINCT viewer_fingerprint)::INTEGER
  FROM view_tracking
  WHERE content_id = p_content_id 
    AND content_type = p_content_type;
$$;
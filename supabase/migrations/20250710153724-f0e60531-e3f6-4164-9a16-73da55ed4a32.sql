-- Create table for tracking user sessions with geographic data
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL,
  ip_address INET,
  country TEXT,
  region TEXT,
  city TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  user_agent TEXT,
  device_type TEXT,
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  page_views INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Creators can view sessions for their content
CREATE POLICY "Creators can view their content sessions" ON user_sessions
  FOR SELECT USING (creator_id = auth.uid());

-- System can insert session data
CREATE POLICY "System can insert session data" ON user_sessions
  FOR INSERT WITH CHECK (true);

-- Users can update their own sessions
CREATE POLICY "Users can update own sessions" ON user_sessions
  FOR UPDATE USING (user_id = auth.uid() OR creator_id = auth.uid());

-- Add indexes for performance
CREATE INDEX idx_user_sessions_creator_id ON user_sessions(creator_id);
CREATE INDEX idx_user_sessions_country ON user_sessions(country);
CREATE INDEX idx_user_sessions_created_at ON user_sessions(created_at);

-- Create function to get geographic analytics
CREATE OR REPLACE FUNCTION get_geographic_analytics(p_creator_id UUID, p_days INTEGER DEFAULT 30)
RETURNS TABLE(
  country TEXT,
  region TEXT,
  city TEXT,
  session_count BIGINT,
  unique_users BIGINT,
  total_page_views BIGINT,
  avg_latitude DECIMAL,
  avg_longitude DECIMAL
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    us.country,
    us.region,
    us.city,
    COUNT(*)::BIGINT as session_count,
    COUNT(DISTINCT us.user_id)::BIGINT as unique_users,
    SUM(us.page_views)::BIGINT as total_page_views,
    AVG(us.latitude) as avg_latitude,
    AVG(us.longitude) as avg_longitude
  FROM user_sessions us
  WHERE us.creator_id = p_creator_id
    AND us.created_at >= NOW() - (p_days || ' days')::INTERVAL
    AND us.country IS NOT NULL
  GROUP BY us.country, us.region, us.city
  ORDER BY session_count DESC;
END;
$$;
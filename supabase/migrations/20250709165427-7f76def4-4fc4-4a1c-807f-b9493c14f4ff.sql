-- Phase 1: Essential Features Database Setup

-- Real-time Notifications System
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced User Analytics
CREATE TABLE IF NOT EXISTS public.user_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  daily_views INTEGER DEFAULT 0,
  weekly_views INTEGER DEFAULT 0,
  monthly_views INTEGER DEFAULT 0,
  total_engagement_score DECIMAL DEFAULT 0,
  profile_visits INTEGER DEFAULT 0,
  content_interactions INTEGER DEFAULT 0,
  follower_growth INTEGER DEFAULT 0,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Enhanced Search & Discovery
CREATE TABLE IF NOT EXISTS public.user_interests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  interest TEXT NOT NULL,
  weight DECIMAL DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, interest)
);

CREATE TABLE IF NOT EXISTS public.search_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  search_query TEXT NOT NULL,
  search_type TEXT DEFAULT 'content',
  results_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Recommendations Engine
CREATE TABLE IF NOT EXISTS public.content_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL,
  content_type TEXT NOT NULL,
  recommendation_score DECIMAL DEFAULT 0,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

-- Phase 2: Revenue & Engagement Features

-- Advanced Messaging System
CREATE TABLE IF NOT EXISTS public.message_threads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participants UUID[] NOT NULL,
  thread_type TEXT DEFAULT 'direct', -- direct, group, broadcast
  title TEXT,
  is_archived BOOLEAN DEFAULT FALSE,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.direct_messages ADD COLUMN IF NOT EXISTS thread_id UUID REFERENCES public.message_threads(id);
ALTER TABLE public.direct_messages ADD COLUMN IF NOT EXISTS message_status TEXT DEFAULT 'sent'; -- sent, delivered, read
ALTER TABLE public.direct_messages ADD COLUMN IF NOT EXISTS reply_to_id UUID REFERENCES public.direct_messages(id);

-- Monetization Features
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscriber_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_type TEXT NOT NULL, -- monthly, yearly, lifetime
  amount DECIMAL NOT NULL,
  status TEXT DEFAULT 'active', -- active, cancelled, expired
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  message TEXT,
  tip_type TEXT DEFAULT 'general', -- general, post, message
  content_id UUID,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Phase 3: Advanced Features

-- Community Features
CREATE TABLE IF NOT EXISTS public.communities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  avatar_url TEXT,
  banner_url TEXT,
  is_private BOOLEAN DEFAULT FALSE,
  member_count INTEGER DEFAULT 0,
  rules JSONB DEFAULT '[]',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.community_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member', -- owner, admin, moderator, member
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(community_id, user_id)
);

-- Advanced Analytics
CREATE TABLE IF NOT EXISTS public.content_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID NOT NULL,
  content_type TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  views INTEGER DEFAULT 0,
  unique_views INTEGER DEFAULT 0,
  engagement_rate DECIMAL DEFAULT 0,
  avg_watch_time INTEGER DEFAULT 0,
  bounce_rate DECIMAL DEFAULT 0,
  conversion_rate DECIMAL DEFAULT 0,
  revenue_generated DECIMAL DEFAULT 0,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(content_id, content_type, date)
);

-- Enable RLS on all new tables
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for User Analytics
CREATE POLICY "Users can view own analytics" ON public.user_analytics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage analytics" ON public.user_analytics FOR ALL WITH CHECK (true);

-- RLS Policies for User Interests
CREATE POLICY "Users can manage own interests" ON public.user_interests FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for Search History
CREATE POLICY "Users can view own search history" ON public.search_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create search history" ON public.search_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for Content Recommendations
CREATE POLICY "Users can view own recommendations" ON public.content_recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage recommendations" ON public.content_recommendations FOR ALL WITH CHECK (true);

-- RLS Policies for Message Threads
CREATE POLICY "Users can view threads they participate in" ON public.message_threads FOR SELECT USING (auth.uid() = ANY(participants) OR auth.uid() = created_by);
CREATE POLICY "Users can create threads" ON public.message_threads FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Thread participants can update" ON public.message_threads FOR UPDATE USING (auth.uid() = ANY(participants) OR auth.uid() = created_by);

-- RLS Policies for Subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.user_subscriptions FOR SELECT USING (auth.uid() = subscriber_id OR auth.uid() = creator_id);
CREATE POLICY "Users can create subscriptions" ON public.user_subscriptions FOR INSERT WITH CHECK (auth.uid() = subscriber_id);

-- RLS Policies for Tips
CREATE POLICY "Users can view own tips" ON public.tips FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can send tips" ON public.tips FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- RLS Policies for Communities
CREATE POLICY "Anyone can view public communities" ON public.communities FOR SELECT USING (NOT is_private);
CREATE POLICY "Members can view private communities" ON public.communities FOR SELECT USING (
  is_private AND EXISTS (
    SELECT 1 FROM public.community_members 
    WHERE community_id = communities.id AND user_id = auth.uid()
  )
);
CREATE POLICY "Users can create communities" ON public.communities FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Owners can update communities" ON public.communities FOR UPDATE USING (auth.uid() = created_by);

-- RLS Policies for Community Members
CREATE POLICY "Members can view community membership" ON public.community_members FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.communities WHERE id = community_id AND (NOT is_private OR auth.uid() = user_id))
);
CREATE POLICY "Users can join communities" ON public.community_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave communities" ON public.community_members FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Content Analytics
CREATE POLICY "Users can view own content analytics" ON public.content_analytics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage content analytics" ON public.content_analytics FOR ALL WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_created_at ON public.notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id_date ON public.user_analytics(user_id, date);
CREATE INDEX IF NOT EXISTS idx_search_history_user_id_created_at ON public.search_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_recommendations_user_id_score ON public.content_recommendations(user_id, recommendation_score DESC);
CREATE INDEX IF NOT EXISTS idx_message_threads_participants ON public.message_threads USING GIN(participants);
CREATE INDEX IF NOT EXISTS idx_communities_tags ON public.communities USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_content_analytics_content_date ON public.content_analytics(content_id, content_type, date);

-- Update triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON public.notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_analytics_updated_at BEFORE UPDATE ON public.user_analytics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_message_threads_updated_at BEFORE UPDATE ON public.message_threads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON public.user_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_communities_updated_at BEFORE UPDATE ON public.communities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
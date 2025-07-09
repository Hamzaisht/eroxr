-- RLS Policies for new tables
-- User Analytics Policies
CREATE POLICY "Users can view own analytics" ON public.user_analytics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage analytics" ON public.user_analytics FOR ALL WITH CHECK (true);

-- User Interests Policies  
CREATE POLICY "Users can manage own interests" ON public.user_interests FOR ALL USING (auth.uid() = user_id);

-- Search History Policies
CREATE POLICY "Users can view own search history" ON public.search_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create search history" ON public.search_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Content Recommendations Policies
CREATE POLICY "Users can view own recommendations" ON public.content_recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage recommendations" ON public.content_recommendations FOR ALL WITH CHECK (true);

-- Message Threads Policies
CREATE POLICY "Users can view participating threads" ON public.message_threads FOR SELECT USING (auth.uid() = ANY(participants) OR auth.uid() = created_by);
CREATE POLICY "Users can create threads" ON public.message_threads FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Thread participants can update" ON public.message_threads FOR UPDATE USING (auth.uid() = ANY(participants) OR auth.uid() = created_by);

-- User Subscriptions Policies
CREATE POLICY "Users can view own subscriptions" ON public.user_subscriptions FOR SELECT USING (auth.uid() = subscriber_id OR auth.uid() = creator_id);
CREATE POLICY "Users can create subscriptions" ON public.user_subscriptions FOR INSERT WITH CHECK (auth.uid() = subscriber_id);

-- Tips Policies
CREATE POLICY "Users can view own tips" ON public.tips FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can send tips" ON public.tips FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Communities Policies
CREATE POLICY "Anyone can view public communities" ON public.communities FOR SELECT USING (NOT is_private);
CREATE POLICY "Members can view private communities" ON public.communities FOR SELECT USING (
  is_private AND EXISTS (
    SELECT 1 FROM public.community_members 
    WHERE community_id = communities.id AND user_id = auth.uid()
  )
);
CREATE POLICY "Users can create communities" ON public.communities FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Owners can update communities" ON public.communities FOR UPDATE USING (auth.uid() = created_by);

-- Community Members Policies
CREATE POLICY "Members can view community membership" ON public.community_members FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.communities WHERE id = community_id AND (NOT is_private OR auth.uid() = user_id))
);
CREATE POLICY "Users can join communities" ON public.community_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave communities" ON public.community_members FOR DELETE USING (auth.uid() = user_id);

-- Content Analytics Policies
CREATE POLICY "Users can view own content analytics" ON public.content_analytics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage content analytics" ON public.content_analytics FOR ALL WITH CHECK (true);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id_date ON public.user_analytics(user_id, date);
CREATE INDEX IF NOT EXISTS idx_search_history_user_id_created_at ON public.search_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_recommendations_user_id_score ON public.content_recommendations(user_id, recommendation_score DESC);
CREATE INDEX IF NOT EXISTS idx_message_threads_participants ON public.message_threads USING GIN(participants);
CREATE INDEX IF NOT EXISTS idx_communities_tags ON public.communities USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_content_analytics_content_date ON public.content_analytics(content_id, content_type, date);
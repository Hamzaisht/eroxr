-- Remove demo user profiles and their associated content
-- Demo user IDs: ArtisticSoul, TechGuru, FitnessPro

DO $$
DECLARE
  demo_user_ids UUID[] := ARRAY[
    'a4f6f8db-5d12-484d-8c9e-c32612620fe0', -- ArtisticSoul
    '1caf8d6f-caa0-4788-bc3b-94e3a7fb28fa', -- TechGuru  
    'b001f5e5-7eed-4c8d-b6b8-fa1ca48523ce'  -- FitnessPro
  ];
  demo_user_id UUID;
BEGIN
  -- Loop through each demo user ID
  FOREACH demo_user_id IN ARRAY demo_user_ids
  LOOP
    -- Remove data from tables that have the exact column names
    
    -- Direct messages (sender_id, recipient_id)
    DELETE FROM direct_messages 
    WHERE sender_id = demo_user_id OR recipient_id = demo_user_id;
    
    -- Posts (creator_id)
    DELETE FROM posts WHERE creator_id = demo_user_id;
    
    -- Post likes (user_id)
    DELETE FROM post_likes WHERE user_id = demo_user_id;
    
    -- Post saves (user_id)
    DELETE FROM post_saves WHERE user_id = demo_user_id;
    
    -- Comments (user_id)
    DELETE FROM comments WHERE user_id = demo_user_id;
    
    -- Followers (follower_id, following_id)
    DELETE FROM followers 
    WHERE follower_id = demo_user_id OR following_id = demo_user_id;
    
    -- Creator likes (user_id, creator_id)
    DELETE FROM creator_likes 
    WHERE user_id = demo_user_id OR creator_id = demo_user_id;
    
    -- Creator metrics (user_id)
    DELETE FROM creator_metrics WHERE user_id = demo_user_id;
    
    -- Creator content prices (creator_id)
    DELETE FROM creator_content_prices WHERE creator_id = demo_user_id;
    
    -- Booking slots (creator_id)
    DELETE FROM booking_slots WHERE creator_id = demo_user_id;
    
    -- Bookings (user_id, creator_id)
    DELETE FROM bookings 
    WHERE user_id = demo_user_id OR creator_id = demo_user_id;
    
    -- Live streams (creator_id)
    DELETE FROM live_streams WHERE creator_id = demo_user_id;
    
    -- Live stream chat (sender_id)
    DELETE FROM live_stream_chat WHERE sender_id = demo_user_id;
    
    -- Live stream viewers (viewer_id)
    DELETE FROM live_stream_viewers WHERE viewer_id = demo_user_id;
    
    -- Stories (creator_id)
    DELETE FROM stories WHERE creator_id = demo_user_id;
    
    -- Media assets (user_id)
    DELETE FROM media_assets WHERE user_id = demo_user_id;
    
    -- Videos (creator_id)
    DELETE FROM videos WHERE creator_id = demo_user_id;
    
    -- Video likes (user_id)
    DELETE FROM video_likes WHERE user_id = demo_user_id;
    
    -- Video comments (user_id)
    DELETE FROM video_comments WHERE user_id = demo_user_id;
    
    -- Video views (user_id)
    DELETE FROM video_views WHERE user_id = demo_user_id;
    
    -- Dating ads (user_id)
    DELETE FROM dating_ads WHERE user_id = demo_user_id;
    
    -- Notifications (user_id)
    DELETE FROM notifications WHERE user_id = demo_user_id;
    
    -- Call history (caller_id, recipient_id)
    DELETE FROM call_history 
    WHERE caller_id = demo_user_id OR recipient_id = demo_user_id;
    
    -- Call notifications (user_id)
    DELETE FROM call_notifications WHERE user_id = demo_user_id;
    
    -- Search history (user_id)
    DELETE FROM search_history WHERE user_id = demo_user_id;
    
    -- User roles (user_id)
    DELETE FROM user_roles WHERE user_id = demo_user_id;
    
    -- Subscriptions (user_id, creator_id)
    DELETE FROM subscriptions 
    WHERE user_id = demo_user_id OR creator_id = demo_user_id;
    
    -- Tips (sender_id, recipient_id)
    DELETE FROM tips 
    WHERE sender_id = demo_user_id OR recipient_id = demo_user_id;
    
    -- Stripe accounts (user_id)
    DELETE FROM stripe_accounts WHERE user_id = demo_user_id;
    
    -- Stripe customers (user_id)
    DELETE FROM stripe_customers WHERE user_id = demo_user_id;
    
    -- Platform subscriptions (user_id)
    DELETE FROM platform_subscriptions WHERE user_id = demo_user_id;
    
    -- Content analytics (user_id)
    DELETE FROM content_analytics WHERE user_id = demo_user_id;
    
    -- Content recommendations (user_id)
    DELETE FROM content_recommendations WHERE user_id = demo_user_id;
    
    -- Post media actions (user_id)
    DELETE FROM post_media_actions WHERE user_id = demo_user_id;
    
    -- Post purchases (user_id)
    DELETE FROM post_purchases WHERE user_id = demo_user_id;
    
    -- ID verifications (user_id)
    DELETE FROM id_verifications WHERE user_id = demo_user_id;
    
    -- Sounds (creator_id)
    DELETE FROM sounds WHERE creator_id = demo_user_id;
    
    -- Payout requests (creator_id)
    DELETE FROM payout_requests WHERE creator_id = demo_user_id;
    
    -- Creator payouts (creator_id)
    DELETE FROM creator_payouts WHERE creator_id = demo_user_id;
    
    -- PPV unlocks (user_id, creator_id)
    DELETE FROM ppv_unlocks 
    WHERE user_id = demo_user_id OR creator_id = demo_user_id;
    
    -- Reports (reporter_id, reported_id)
    DELETE FROM reports 
    WHERE reporter_id = demo_user_id OR reported_id = demo_user_id;
    
    -- Security violations (violator_id, content_owner_id)
    DELETE FROM security_violations 
    WHERE violator_id = demo_user_id OR content_owner_id = demo_user_id;
    
    -- View tracking (user_id)
    DELETE FROM view_tracking WHERE user_id = demo_user_id;
    
    -- Trending content (creator_id)
    DELETE FROM trending_content WHERE creator_id = demo_user_id;
    
    -- Video folders (user_id)
    DELETE FROM video_folders WHERE user_id = demo_user_id;
    
    -- User activity logs (user_id)
    DELETE FROM user_activity_logs WHERE user_id = demo_user_id;
    
    -- User analytics (user_id)
    DELETE FROM user_analytics WHERE user_id = demo_user_id;
    
    -- User interests (user_id)
    DELETE FROM user_interests WHERE user_id = demo_user_id;
    
    -- User sessions (user_id)
    DELETE FROM user_sessions WHERE user_id = demo_user_id;

    RAISE NOTICE 'Removed all content for demo user: %', demo_user_id;
  END LOOP;
  
  -- Finally, remove the demo user profiles
  DELETE FROM profiles WHERE id = ANY(demo_user_ids);
  
  -- Drop the temp_demo_content table if it exists
  DROP TABLE IF EXISTS temp_demo_content CASCADE;
  
  RAISE NOTICE 'Demo content cleanup completed successfully. Removed % demo users and all their associated content.', array_length(demo_user_ids, 1);
END $$;
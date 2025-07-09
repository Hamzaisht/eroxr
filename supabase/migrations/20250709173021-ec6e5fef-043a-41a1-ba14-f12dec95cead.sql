-- Create sample data for Eroboard testing (only if no data exists)

-- Function to create sample data for testing
CREATE OR REPLACE FUNCTION public.create_sample_eroboard_data(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only create data if user has no existing posts
  IF NOT EXISTS (SELECT 1 FROM posts WHERE creator_id = p_user_id) THEN
    
    -- Insert sample posts with earnings
    INSERT INTO posts (id, creator_id, content, view_count, likes_count, comments_count, created_at, media_url, video_urls)
    VALUES 
      (gen_random_uuid(), p_user_id, 'Sample premium content #1', 1250, 89, 23, NOW() - INTERVAL '5 days', ARRAY['image1.jpg'], NULL),
      (gen_random_uuid(), p_user_id, 'Exclusive video content', 2100, 156, 45, NOW() - INTERVAL '3 days', NULL, ARRAY['video1.mp4']),
      (gen_random_uuid(), p_user_id, 'Behind the scenes content', 890, 67, 12, NOW() - INTERVAL '7 days', ARRAY['image2.jpg'], NULL),
      (gen_random_uuid(), p_user_id, 'Live stream recap video', 1750, 134, 38, NOW() - INTERVAL '2 days', NULL, ARRAY['video2.mp4']),
      (gen_random_uuid(), p_user_id, 'Photo set collection', 980, 78, 19, NOW() - INTERVAL '6 days', ARRAY['image3.jpg', 'image4.jpg'], NULL);

    -- Insert sample post purchases for earnings
    INSERT INTO post_purchases (post_id, user_id, amount, created_at)
    SELECT 
      p.id,
      gen_random_uuid(), -- Random buyer
      CASE 
        WHEN random() < 0.3 THEN (random() * 4 + 1)::numeric -- Tips: $1-5
        WHEN random() < 0.6 THEN (random() * 15 + 5)::numeric -- PPV: $5-20
        ELSE (random() * 30 + 20)::numeric -- Subscriptions: $20-50
      END,
      p.created_at + (random() * INTERVAL '2 days')
    FROM posts p 
    WHERE p.creator_id = p_user_id
    CROSS JOIN generate_series(1, (random() * 10 + 5)::int); -- 5-15 purchases per post

    -- Insert sample creator subscriptions
    INSERT INTO creator_subscriptions (creator_id, user_id, created_at)
    SELECT 
      p_user_id,
      gen_random_uuid(),
      NOW() - (random() * INTERVAL '30 days')
    FROM generate_series(1, (random() * 50 + 25)::int); -- 25-75 subscribers

    -- Insert sample followers
    INSERT INTO followers (follower_id, following_id, created_at)
    SELECT 
      gen_random_uuid(),
      p_user_id,
      NOW() - (random() * INTERVAL '60 days')
    FROM generate_series(1, (random() * 200 + 100)::int) -- 100-300 followers
    ON CONFLICT DO NOTHING;

    -- Insert/update creator metrics
    INSERT INTO creator_metrics (user_id, followers, views, engagement_score, earnings, popularity_score)
    VALUES (
      p_user_id,
      (SELECT COUNT(*) FROM followers WHERE following_id = p_user_id),
      (SELECT COALESCE(SUM(view_count), 0) FROM posts WHERE creator_id = p_user_id),
      (SELECT COALESCE(AVG(engagement_score), 0) FROM posts WHERE creator_id = p_user_id),
      (SELECT COALESCE(SUM(pp.amount), 0) FROM posts p JOIN post_purchases pp ON p.id = pp.post_id WHERE p.creator_id = p_user_id),
      random() * 100
    )
    ON CONFLICT (user_id) DO UPDATE SET
      followers = EXCLUDED.followers,
      views = EXCLUDED.views,
      engagement_score = EXCLUDED.engagement_score,
      earnings = EXCLUDED.earnings,
      popularity_score = EXCLUDED.popularity_score,
      updated_at = NOW();

    -- Insert sample engagement actions
    INSERT INTO post_media_actions (post_id, user_id, action_type, created_at)
    SELECT 
      p.id,
      gen_random_uuid(),
      CASE 
        WHEN random() < 0.4 THEN 'like'
        WHEN random() < 0.7 THEN 'view'
        WHEN random() < 0.9 THEN 'share'
        ELSE 'screenshot'
      END,
      p.created_at + (random() * INTERVAL '5 days')
    FROM posts p 
    WHERE p.creator_id = p_user_id
    CROSS JOIN generate_series(1, (random() * 20 + 10)::int); -- 10-30 actions per post

  END IF;
END;
$$;

-- Create sample data for current user if they exist
DO $$
DECLARE
  current_user_id UUID;
BEGIN
  -- Get a user ID from auth.users if any exists
  SELECT id INTO current_user_id FROM auth.users LIMIT 1;
  
  IF current_user_id IS NOT NULL THEN
    -- Ensure profile exists
    INSERT INTO profiles (id, username) 
    VALUES (current_user_id, 'sample_creator')
    ON CONFLICT (id) DO NOTHING;
    
    -- Create sample data
    PERFORM create_sample_eroboard_data(current_user_id);
  END IF;
END;
$$;
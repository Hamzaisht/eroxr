-- Create a simple function to populate sample analytics data for testing
CREATE OR REPLACE FUNCTION public.create_sample_analytics_data_for_user(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  post_ids UUID[];
  post_id UUID;
  i INTEGER;
  j INTEGER;
BEGIN
  -- Only create data if user has no existing posts
  IF NOT EXISTS (SELECT 1 FROM posts WHERE creator_id = p_user_id) THEN
    
    -- Insert sample posts
    INSERT INTO posts (id, creator_id, content, view_count, likes_count, comments_count, created_at, media_url, video_urls)
    VALUES 
      (gen_random_uuid(), p_user_id, 'Sample premium content #1', 1250, 89, 23, NOW() - INTERVAL '5 days', ARRAY['image1.jpg'], NULL),
      (gen_random_uuid(), p_user_id, 'Exclusive video content', 2100, 156, 45, NOW() - INTERVAL '3 days', NULL, ARRAY['video1.mp4']),
      (gen_random_uuid(), p_user_id, 'Behind the scenes content', 890, 67, 12, NOW() - INTERVAL '7 days', ARRAY['image2.jpg'], NULL),
      (gen_random_uuid(), p_user_id, 'Live stream recap video', 1750, 134, 38, NOW() - INTERVAL '2 days', NULL, ARRAY['video2.mp4']),
      (gen_random_uuid(), p_user_id, 'Photo set collection', 980, 78, 19, NOW() - INTERVAL '6 days', ARRAY['image3.jpg', 'image4.jpg'], NULL);

    -- Get the created post IDs
    SELECT ARRAY_AGG(id) INTO post_ids FROM posts WHERE creator_id = p_user_id;

    -- Insert sample post purchases for each post
    FOREACH post_id IN ARRAY post_ids
    LOOP
      FOR i IN 1..10 LOOP -- 10 purchases per post
        INSERT INTO post_purchases (post_id, user_id, amount, created_at)
        VALUES (
          post_id,
          gen_random_uuid(),
          CASE 
            WHEN random() < 0.3 THEN (random() * 4 + 1)::numeric -- Tips: $1-5
            WHEN random() < 0.6 THEN (random() * 15 + 5)::numeric -- PPV: $5-20
            ELSE (random() * 30 + 20)::numeric -- Subscriptions: $20-50
          END,
          NOW() - (random() * INTERVAL '10 days')
        );
      END LOOP;
    END LOOP;

    -- Insert sample creator subscriptions
    FOR i IN 1..50 LOOP -- 50 subscribers
      INSERT INTO creator_subscriptions (creator_id, user_id, created_at)
      VALUES (
        p_user_id,
        gen_random_uuid(),
        NOW() - (random() * INTERVAL '30 days')
      );
    END LOOP;

    -- Insert sample followers
    FOR i IN 1..150 LOOP -- 150 followers
      INSERT INTO followers (follower_id, following_id, created_at)
      VALUES (
        gen_random_uuid(),
        p_user_id,
        NOW() - (random() * INTERVAL '60 days')
      )
      ON CONFLICT DO NOTHING;
    END LOOP;

    -- Insert sample engagement actions
    FOREACH post_id IN ARRAY post_ids
    LOOP
      FOR i IN 1..15 LOOP -- 15 actions per post
        INSERT INTO post_media_actions (post_id, user_id, action_type, created_at)
        VALUES (
          post_id,
          gen_random_uuid(),
          CASE 
            WHEN random() < 0.4 THEN 'like'
            WHEN random() < 0.7 THEN 'view'
            WHEN random() < 0.9 THEN 'share'
            ELSE 'screenshot'
          END,
          NOW() - (random() * INTERVAL '7 days')
        );
      END LOOP;
    END LOOP;

    -- Update creator metrics
    INSERT INTO creator_metrics (user_id, followers, views, engagement_score, earnings, popularity_score)
    VALUES (
      p_user_id,
      (SELECT COUNT(*) FROM followers WHERE following_id = p_user_id),
      (SELECT COALESCE(SUM(view_count), 0) FROM posts WHERE creator_id = p_user_id),
      75.5, -- Sample engagement score
      (SELECT COALESCE(SUM(pp.amount), 0) FROM posts p JOIN post_purchases pp ON p.id = pp.post_id WHERE p.creator_id = p_user_id),
      85.2 -- Sample popularity score
    )
    ON CONFLICT (user_id) DO UPDATE SET
      followers = EXCLUDED.followers,
      views = EXCLUDED.views,
      engagement_score = EXCLUDED.engagement_score,
      earnings = EXCLUDED.earnings,
      popularity_score = EXCLUDED.popularity_score,
      updated_at = NOW();

  END IF;
END;
$$;
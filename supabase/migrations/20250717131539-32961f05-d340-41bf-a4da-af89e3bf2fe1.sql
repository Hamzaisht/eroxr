-- Final demo content cleanup - targeted removal of demo users
-- Demo user IDs: ArtisticSoul, TechGuru, FitnessPro

DO $$
DECLARE
  demo_user_ids UUID[] := ARRAY[
    'a4f6f8db-5d12-484d-8c9e-c32612620fe0', -- ArtisticSoul
    '1caf8d6f-caa0-4788-bc3b-94e3a7fb28fa', -- TechGuru  
    'b001f5e5-7eed-4c8d-b6b8-fa1ca48523ce'  -- FitnessPro
  ];
  demo_user_id UUID;
  deleted_count INTEGER;
BEGIN
  -- Loop through each demo user ID and remove their content
  FOREACH demo_user_id IN ARRAY demo_user_ids
  LOOP
    -- Remove direct messages
    DELETE FROM direct_messages 
    WHERE sender_id = demo_user_id OR recipient_id = demo_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Removed % direct messages for user %', deleted_count, demo_user_id;
    
    -- Remove posts
    DELETE FROM posts WHERE creator_id = demo_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Removed % posts for user %', deleted_count, demo_user_id;
    
    -- Remove followers/following relationships
    DELETE FROM followers 
    WHERE follower_id = demo_user_id OR following_id = demo_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Removed % follower relationships for user %', deleted_count, demo_user_id;
    
    -- Remove creator metrics
    DELETE FROM creator_metrics WHERE user_id = demo_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Removed % creator metrics for user %', deleted_count, demo_user_id;
    
    -- Remove subscriptions (using correct column names)
    DELETE FROM subscriptions 
    WHERE subscriber_id = demo_user_id OR creator_id = demo_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Removed % subscriptions for user %', deleted_count, demo_user_id;
    
    -- Remove creator content prices
    DELETE FROM creator_content_prices WHERE creator_id = demo_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Removed % content prices for user %', deleted_count, demo_user_id;
    
    -- Remove other content only if tables exist and have correct columns
    BEGIN
      DELETE FROM post_likes WHERE user_id = demo_user_id;
    EXCEPTION
      WHEN undefined_column THEN NULL; -- Skip if column doesn't exist
    END;
    
    BEGIN
      DELETE FROM post_saves WHERE user_id = demo_user_id;
    EXCEPTION
      WHEN undefined_column THEN NULL;
    END;
    
    BEGIN
      DELETE FROM comments WHERE user_id = demo_user_id;
    EXCEPTION
      WHEN undefined_column THEN NULL;
    END;
    
    BEGIN
      DELETE FROM creator_likes 
      WHERE user_id = demo_user_id OR creator_id = demo_user_id;
    EXCEPTION
      WHEN undefined_column THEN NULL;
    END;
    
    BEGIN
      DELETE FROM live_streams WHERE creator_id = demo_user_id;
    EXCEPTION
      WHEN undefined_column THEN NULL;
    END;
    
    BEGIN
      DELETE FROM stories WHERE creator_id = demo_user_id;
    EXCEPTION
      WHEN undefined_column THEN NULL;
    END;
    
    BEGIN
      DELETE FROM media_assets WHERE user_id = demo_user_id;
    EXCEPTION
      WHEN undefined_column THEN NULL;
    END;
    
    BEGIN
      DELETE FROM videos WHERE creator_id = demo_user_id;
    EXCEPTION
      WHEN undefined_column THEN NULL;
    END;
    
    BEGIN
      DELETE FROM notifications WHERE user_id = demo_user_id;
    EXCEPTION
      WHEN undefined_column THEN NULL;
    END;

    RAISE NOTICE 'Completed cleanup for demo user: %', demo_user_id;
  END LOOP;
  
  -- Finally, remove the demo user profiles
  DELETE FROM profiles WHERE id = ANY(demo_user_ids);
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RAISE NOTICE 'Removed % demo user profiles', deleted_count;
  
  -- Drop the temp_demo_content table if it exists
  DROP TABLE IF EXISTS temp_demo_content CASCADE;
  
  RAISE NOTICE 'Demo content cleanup completed successfully!';
END $$;
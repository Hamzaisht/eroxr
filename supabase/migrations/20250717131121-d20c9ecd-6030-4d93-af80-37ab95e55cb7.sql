-- Remove all demo content and demo user profiles
-- This migration removes demo users and any content associated with them

-- Demo user IDs to remove
-- ArtisticSoul: a4f6f8db-5d12-484d-8c9e-c32612620fe0
-- TechGuru: 1caf8d6f-caa0-4788-bc3b-94e3a7fb28fa  
-- FitnessPro: b001f5e5-7eed-4c8d-b6b8-fa1ca48523ce

-- First, let's create a temporary table to store demo user IDs for easy reference
CREATE TEMP TABLE demo_users AS 
SELECT unnest(ARRAY[
    'a4f6f8db-5d12-484d-8c9e-c32612620fe0',
    '1caf8d6f-caa0-4788-bc3b-94e3a7fb28fa', 
    'b001f5e5-7eed-4c8d-b6b8-fa1ca48523ce'
]::uuid[]) as user_id;

-- Remove content associated with demo users across all tables
-- Note: We'll be careful to only remove data associated with the identified demo users

-- 1. Remove direct messages sent by or to demo users
DELETE FROM direct_messages 
WHERE sender_id IN (SELECT user_id FROM demo_users) 
   OR recipient_id IN (SELECT user_id FROM demo_users);

-- 2. Remove posts created by demo users
DELETE FROM posts 
WHERE creator_id IN (SELECT user_id FROM demo_users);

-- 3. Remove post likes by demo users
DELETE FROM post_likes 
WHERE user_id IN (SELECT user_id FROM demo_users);

-- 4. Remove post saves by demo users
DELETE FROM post_saves 
WHERE user_id IN (SELECT user_id FROM demo_users);

-- 5. Remove comments by demo users
DELETE FROM comments 
WHERE user_id IN (SELECT user_id FROM demo_users);

-- 6. Remove followers/following relationships involving demo users
DELETE FROM followers 
WHERE follower_id IN (SELECT user_id FROM demo_users) 
   OR following_id IN (SELECT user_id FROM demo_users);

-- 7. Remove creator likes involving demo users
DELETE FROM creator_likes 
WHERE user_id IN (SELECT user_id FROM demo_users) 
   OR creator_id IN (SELECT user_id FROM demo_users);

-- 8. Remove creator metrics for demo users
DELETE FROM creator_metrics 
WHERE user_id IN (SELECT user_id FROM demo_users);

-- 9. Remove creator content prices for demo users
DELETE FROM creator_content_prices 
WHERE creator_id IN (SELECT user_id FROM demo_users);

-- 10. Remove booking slots created by demo users
DELETE FROM booking_slots 
WHERE creator_id IN (SELECT user_id FROM demo_users);

-- 11. Remove bookings involving demo users
DELETE FROM bookings 
WHERE user_id IN (SELECT user_id FROM demo_users) 
   OR creator_id IN (SELECT user_id FROM demo_users);

-- 12. Remove live streams by demo users
DELETE FROM live_streams 
WHERE creator_id IN (SELECT user_id FROM demo_users);

-- 13. Remove live stream chat messages by demo users
DELETE FROM live_stream_chat 
WHERE sender_id IN (SELECT user_id FROM demo_users);

-- 14. Remove live stream viewers records for demo users
DELETE FROM live_stream_viewers 
WHERE viewer_id IN (SELECT user_id FROM demo_users);

-- 15. Remove stories by demo users
DELETE FROM stories 
WHERE creator_id IN (SELECT user_id FROM demo_users);

-- 16. Remove media assets uploaded by demo users
DELETE FROM media_assets 
WHERE user_id IN (SELECT user_id FROM demo_users);

-- 17. Remove videos by demo users
DELETE FROM videos 
WHERE creator_id IN (SELECT user_id FROM demo_users);

-- 18. Remove video likes by demo users
DELETE FROM video_likes 
WHERE user_id IN (SELECT user_id FROM demo_users);

-- 19. Remove video comments by demo users
DELETE FROM video_comments 
WHERE user_id IN (SELECT user_id FROM demo_users);

-- 20. Remove video views by demo users
DELETE FROM video_views 
WHERE user_id IN (SELECT user_id FROM demo_users);

-- 21. Remove dating ads by demo users
DELETE FROM dating_ads 
WHERE user_id IN (SELECT user_id FROM demo_users);

-- 22. Remove notifications for demo users
DELETE FROM notifications 
WHERE user_id IN (SELECT user_id FROM demo_users);

-- 23. Remove call history involving demo users
DELETE FROM call_history 
WHERE caller_id IN (SELECT user_id FROM demo_users) 
   OR recipient_id IN (SELECT user_id FROM demo_users);

-- 24. Remove call notifications for demo users
DELETE FROM call_notifications 
WHERE user_id IN (SELECT user_id FROM demo_users);

-- 25. Remove search history for demo users
DELETE FROM search_history 
WHERE user_id IN (SELECT user_id FROM demo_users);

-- 26. Remove user activity logs for demo users
DELETE FROM user_activity_logs 
WHERE user_id IN (SELECT user_id FROM demo_users);

-- 27. Remove user analytics for demo users
DELETE FROM user_analytics 
WHERE user_id IN (SELECT user_id FROM demo_users);

-- 28. Remove user interests for demo users
DELETE FROM user_interests 
WHERE user_id IN (SELECT user_id FROM demo_users);

-- 29. Remove user roles for demo users
DELETE FROM user_roles 
WHERE user_id IN (SELECT user_id FROM demo_users);

-- 30. Remove user sessions for demo users
DELETE FROM user_sessions 
WHERE user_id IN (SELECT user_id FROM demo_users);

-- 31. Remove subscriptions involving demo users
DELETE FROM subscriptions 
WHERE user_id IN (SELECT user_id FROM demo_users) 
   OR creator_id IN (SELECT user_id FROM demo_users);

-- 32. Remove tips involving demo users
DELETE FROM tips 
WHERE sender_id IN (SELECT user_id FROM demo_users) 
   OR recipient_id IN (SELECT user_id FROM demo_users);

-- 33. Remove stripe accounts for demo users
DELETE FROM stripe_accounts 
WHERE user_id IN (SELECT user_id FROM demo_users);

-- 34. Remove stripe customers for demo users
DELETE FROM stripe_customers 
WHERE user_id IN (SELECT user_id FROM demo_users);

-- 35. Remove platform subscriptions for demo users
DELETE FROM platform_subscriptions 
WHERE user_id IN (SELECT user_id FROM demo_users);

-- 36. Remove content analytics for demo users
DELETE FROM content_analytics 
WHERE user_id IN (SELECT user_id FROM demo_users);

-- 37. Remove content recommendations for demo users
DELETE FROM content_recommendations 
WHERE user_id IN (SELECT user_id FROM demo_users);

-- 38. Remove post media actions by demo users
DELETE FROM post_media_actions 
WHERE user_id IN (SELECT user_id FROM demo_users);

-- 39. Remove post purchases by demo users
DELETE FROM post_purchases 
WHERE user_id IN (SELECT user_id FROM demo_users);

-- 40. Remove message threads involving demo users
DELETE FROM message_threads 
WHERE created_by IN (SELECT user_id FROM demo_users) 
   OR participants && (SELECT array_agg(user_id::text) FROM demo_users);

-- 41. Remove id verifications for demo users
DELETE FROM id_verifications 
WHERE user_id IN (SELECT user_id FROM demo_users);

-- 42. Remove sounds created by demo users
DELETE FROM sounds 
WHERE creator_id IN (SELECT user_id FROM demo_users);

-- 43. Remove payout requests by demo users
DELETE FROM payout_requests 
WHERE creator_id IN (SELECT user_id FROM demo_users);

-- 44. Remove creator payouts for demo users
DELETE FROM creator_payouts 
WHERE creator_id IN (SELECT user_id FROM demo_users);

-- 45. Remove ppv unlocks involving demo users
DELETE FROM ppv_unlocks 
WHERE user_id IN (SELECT user_id FROM demo_users) 
   OR creator_id IN (SELECT user_id FROM demo_users);

-- 46. Remove reports involving demo users
DELETE FROM reports 
WHERE reporter_id IN (SELECT user_id FROM demo_users) 
   OR reported_id IN (SELECT user_id FROM demo_users);

-- 47. Remove security violations involving demo users
DELETE FROM security_violations 
WHERE violator_id IN (SELECT user_id FROM demo_users) 
   OR content_owner_id IN (SELECT user_id FROM demo_users);

-- 48. Remove view tracking for demo users
DELETE FROM view_tracking 
WHERE user_id IN (SELECT user_id FROM demo_users);

-- 49. Remove trending content by demo users
DELETE FROM trending_content 
WHERE creator_id IN (SELECT user_id FROM demo_users);

-- 50. Remove webhook events related to demo users (if any)
DELETE FROM webhook_events 
WHERE data->>'user_id' IN (SELECT user_id::text FROM demo_users);

-- 51. Remove video folder items for demo users
DELETE FROM video_folder_items 
WHERE folder_id IN (SELECT id FROM video_folders WHERE user_id IN (SELECT user_id FROM demo_users));

-- 52. Remove video folders for demo users
DELETE FROM video_folders 
WHERE user_id IN (SELECT user_id FROM demo_users);

-- 53. Remove video processing queue entries for demo users
DELETE FROM video_processing_queue 
WHERE user_id IN (SELECT user_id FROM demo_users);

-- 54. Remove video reports involving demo users
DELETE FROM video_reports 
WHERE reporter_id IN (SELECT user_id FROM demo_users);

-- Finally, remove the demo user profiles themselves
DELETE FROM profiles 
WHERE id IN (SELECT user_id FROM demo_users);

-- Drop the temp_demo_content table if it exists and is empty
DROP TABLE IF EXISTS temp_demo_content;

-- Log the cleanup
DO $$
BEGIN
    RAISE NOTICE 'Demo content cleanup completed. All demo users (ArtisticSoul, TechGuru, FitnessPro) and their associated content have been removed.';
END $$;
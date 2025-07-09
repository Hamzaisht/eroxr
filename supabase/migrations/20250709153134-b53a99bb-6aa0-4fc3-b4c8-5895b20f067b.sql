-- Create a function to sync storage uploads with videos table
CREATE OR REPLACE FUNCTION sync_uploaded_videos()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert videos that exist in storage but not in videos table
  INSERT INTO videos (
    creator_id,
    title,
    video_url,
    created_at,
    updated_at,
    visibility
  )
  SELECT 
    CASE 
      -- Extract user ID from path if it follows the pattern user_id/filename
      WHEN name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/' 
      THEN substring(name from '^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})')::uuid
      -- For videos in root, try to determine from filename or default to a specific user
      ELSE 'c8c9335f-f49f-4423-bc18-9cb6360ac53a'::uuid -- Default to current user
    END as creator_id,
    CASE 
      WHEN name ~ '/' THEN split_part(name, '/', 2)
      ELSE name
    END as title,
    'https://ysqbdaeohlupucdmivkt.supabase.co/storage/v1/object/public/videos/' || name as video_url,
    created_at,
    created_at as updated_at,
    'public' as visibility
  FROM storage.objects 
  WHERE bucket_id = 'videos' 
    AND metadata->>'mimetype' LIKE 'video/%'
    AND NOT EXISTS (
      SELECT 1 FROM videos v 
      WHERE v.video_url = 'https://ysqbdaeohlupucdmivkt.supabase.co/storage/v1/object/public/videos/' || storage.objects.name
    );
END;
$$;

-- Run the sync function to catch up existing videos
SELECT sync_uploaded_videos();

-- Add missing content_type column to stories table
ALTER TABLE stories ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'image';

-- Update existing stories to have proper content_type based on their media
UPDATE stories 
SET content_type = CASE 
  WHEN video_url IS NOT NULL THEN 'video'
  ELSE 'image'
END
WHERE content_type IS NULL OR content_type = '';

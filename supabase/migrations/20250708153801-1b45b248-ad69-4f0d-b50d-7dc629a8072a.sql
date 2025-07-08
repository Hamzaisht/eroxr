-- Add video_url and avatar_url columns to dating_ads table
ALTER TABLE public.dating_ads 
ADD COLUMN video_url TEXT,
ADD COLUMN avatar_url TEXT;
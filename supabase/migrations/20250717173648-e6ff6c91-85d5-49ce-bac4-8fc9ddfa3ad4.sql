-- Create likes table for dating ads
CREATE TABLE IF NOT EXISTS public.dating_ad_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  dating_ad_id UUID NOT NULL REFERENCES public.dating_ads(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, dating_ad_id)
);

-- Enable RLS
ALTER TABLE public.dating_ad_likes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can like dating ads" 
ON public.dating_ad_likes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all likes" 
ON public.dating_ad_likes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can unlike dating ads" 
ON public.dating_ad_likes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add likes_count column to dating_ads table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dating_ads' AND column_name = 'likes_count') THEN
        ALTER TABLE public.dating_ads ADD COLUMN likes_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- Create function to update likes count
CREATE OR REPLACE FUNCTION public.update_dating_ad_likes_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.dating_ads 
    SET likes_count = COALESCE(likes_count, 0) + 1
    WHERE id = NEW.dating_ad_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.dating_ads 
    SET likes_count = GREATEST(COALESCE(likes_count, 0) - 1, 0)
    WHERE id = OLD.dating_ad_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Create triggers to automatically update likes count
DROP TRIGGER IF EXISTS update_dating_ad_likes_count_trigger ON public.dating_ad_likes;
CREATE TRIGGER update_dating_ad_likes_count_trigger
  AFTER INSERT OR DELETE ON public.dating_ad_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_dating_ad_likes_count();
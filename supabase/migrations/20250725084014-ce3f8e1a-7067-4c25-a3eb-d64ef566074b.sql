-- Create profile_favorites table for user favorites functionality
CREATE TABLE IF NOT EXISTS public.profile_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dating_ad_id UUID NOT NULL REFERENCES public.dating_ads(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, dating_ad_id)
);

-- Enable Row Level Security
ALTER TABLE public.profile_favorites ENABLE ROW LEVEL SECURITY;

-- Create policies for profile_favorites
CREATE POLICY "Users can view their own favorites" 
ON public.profile_favorites 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites" 
ON public.profile_favorites 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" 
ON public.profile_favorites 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profile_favorites_user_id ON public.profile_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_favorites_dating_ad_id ON public.profile_favorites(dating_ad_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_profile_favorites_updated_at
BEFORE UPDATE ON public.profile_favorites
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
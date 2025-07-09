-- Create video folders/categories table
CREATE TABLE public.video_folders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create junction table for video-folder relationships
CREATE TABLE public.video_folder_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID NOT NULL,
  folder_id UUID NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(video_id, folder_id)
);

-- Enable RLS
ALTER TABLE public.video_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_folder_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for video_folders
CREATE POLICY "Users can view all folders" 
ON public.video_folders 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage their own folders" 
ON public.video_folders 
FOR ALL 
USING (creator_id = auth.uid());

-- RLS Policies for video_folder_items
CREATE POLICY "Users can view all folder items" 
ON public.video_folder_items 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage items in their folders" 
ON public.video_folder_items 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM video_folders 
  WHERE video_folders.id = video_folder_items.folder_id 
  AND video_folders.creator_id = auth.uid()
));

-- Create foreign key constraints
ALTER TABLE public.video_folders 
ADD CONSTRAINT video_folders_creator_id_fkey 
FOREIGN KEY (creator_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE public.video_folder_items 
ADD CONSTRAINT video_folder_items_video_id_fkey 
FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE;

ALTER TABLE public.video_folder_items 
ADD CONSTRAINT video_folder_items_folder_id_fkey 
FOREIGN KEY (folder_id) REFERENCES video_folders(id) ON DELETE CASCADE;

-- Create default folder for existing users
INSERT INTO public.video_folders (creator_id, name, description, is_default)
SELECT DISTINCT creator_id, 'All Videos', 'Default folder containing all videos', true
FROM videos
WHERE creator_id IS NOT NULL;

-- Add all existing videos to their creator's default folder
INSERT INTO public.video_folder_items (video_id, folder_id)
SELECT v.id, vf.id
FROM videos v
JOIN video_folders vf ON v.creator_id = vf.creator_id
WHERE vf.is_default = true;
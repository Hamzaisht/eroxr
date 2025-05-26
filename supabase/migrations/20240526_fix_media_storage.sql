
-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('media', 'media', true, 104857600, ARRAY['image/*', 'video/*']),
  ('posts', 'posts', true, 104857600, ARRAY['image/*', 'video/*']),
  ('stories', 'stories', true, 104857600, ARRAY['image/*', 'video/*'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Create permissive storage policies
CREATE POLICY IF NOT EXISTS "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id IN ('media', 'posts', 'stories'));

CREATE POLICY IF NOT EXISTS "Authenticated users can upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id IN ('media', 'posts', 'stories') AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY IF NOT EXISTS "Users can update their own files" ON storage.objects
  FOR UPDATE USING (
    bucket_id IN ('media', 'posts', 'stories') AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY IF NOT EXISTS "Users can delete their own files" ON storage.objects
  FOR DELETE USING (
    bucket_id IN ('media', 'posts', 'stories') AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

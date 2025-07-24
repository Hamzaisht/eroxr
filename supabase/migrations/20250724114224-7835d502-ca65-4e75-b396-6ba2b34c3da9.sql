-- Ensure we have the proper storage bucket for general media uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'general', 
  'general', 
  true, 
  104857600, -- 100MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Create RLS policies for the general bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can upload to general bucket'
  ) THEN
    CREATE POLICY "Users can upload to general bucket" 
    ON storage.objects 
    FOR INSERT 
    WITH CHECK (bucket_id = 'general' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can view files in general bucket'
  ) THEN
    CREATE POLICY "Users can view files in general bucket" 
    ON storage.objects 
    FOR SELECT 
    USING (bucket_id = 'general');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can update their own files in general bucket'
  ) THEN
    CREATE POLICY "Users can update their own files in general bucket" 
    ON storage.objects 
    FOR UPDATE 
    USING (bucket_id = 'general' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can delete their own files in general bucket'
  ) THEN
    CREATE POLICY "Users can delete their own files in general bucket" 
    ON storage.objects 
    FOR DELETE 
    USING (bucket_id = 'general' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;
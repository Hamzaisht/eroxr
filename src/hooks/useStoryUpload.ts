
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useStoriesFeed } from '@/hooks/useStoriesFeed';
import { supabase } from '@/integrations/supabase/client';

export const useStoryUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();
  const { refetch } = useStoriesFeed();

  const uploadStory = async (file: File, caption?: string) => {
    if (!user?.id) {
      toast({
        title: 'Authentication required',
        description: 'You need to be logged in to upload stories',
        variant: 'destructive',
      });
      return { success: false, error: 'Authentication required' };
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Generate unique filename
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'bin';
      const fileName = `stories/${user.id}-${Date.now()}.${fileExtension}`;

      console.log('Uploading story file:', fileName, 'Size:', file.size, 'Type:', file.type);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('stories')
        .upload(fileName, file, {
          cacheControl: '3600',
          contentType: file.type,
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }

      console.log('File uploaded successfully:', uploadData);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('stories')
        .getPublicUrl(uploadData.path);

      console.log('Generated public URL:', publicUrl);

      // Create story record
      const { data: storyData, error: dbError } = await supabase
        .from('stories')
        .insert({
          creator_id: user.id,
          media_url: file.type.startsWith('image/') ? publicUrl : null,
          video_url: file.type.startsWith('video/') ? publicUrl : null,
          content_type: file.type.startsWith('video/') ? 'video' : 'image',
          is_active: true,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        // Clean up uploaded file if database insert fails
        await supabase.storage.from('stories').remove([uploadData.path]);
        throw new Error(`Database error: ${dbError.message}`);
      }

      console.log('Story created successfully:', storyData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      toast({
        title: 'Story uploaded',
        description: 'Your story has been shared successfully!',
      });

      // Refresh stories feed
      refetch();

      return { success: true, data: storyData };
    } catch (error: any) {
      console.error('Story upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload story',
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadStory,
    uploading,
    uploadProgress,
  };
};

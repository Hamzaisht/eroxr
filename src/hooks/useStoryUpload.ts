
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

      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `stories/${fileName}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('stories')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('stories')
        .getPublicUrl(filePath);

      // Create story record
      const { error: dbError } = await supabase
        .from('stories')
        .insert({
          creator_id: user.id,
          media_url: publicUrl,
          video_url: file.type.startsWith('video/') ? publicUrl : null,
          content_type: file.type.startsWith('video/') ? 'video' : 'image',
          is_active: true,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        });

      if (dbError) throw dbError;

      clearInterval(progressInterval);
      setUploadProgress(100);

      toast({
        title: 'Story uploaded',
        description: 'Your story has been shared successfully!',
      });

      // Refresh stories feed
      refetch();

      return { success: true };
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

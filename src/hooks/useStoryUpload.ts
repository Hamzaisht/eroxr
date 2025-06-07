
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useStoriesFeed } from '@/hooks/useStoriesFeed';
import { uploadMediaToSupabase } from '@/utils/upload/supabaseUpload';
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

      // Use the proven upload method that works for other media
      const result = await uploadMediaToSupabase(file, {
        category: 'stories',
        accessLevel: 'public',
        metadata: {
          caption: caption || null,
          contentType: file.type.startsWith('video/') ? 'video' : 'image'
        }
      });

      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      // Create story record using the uploaded media URL
      const { error: dbError } = await supabase
        .from('stories')
        .insert({
          creator_id: user.id,
          media_url: result.url,
          video_url: file.type.startsWith('video/') ? result.url : null,
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

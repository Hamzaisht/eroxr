
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSession } from '@supabase/auth-helpers-react';
import { useDbService } from './services/useDbService';
import { useStorageService } from './services/useStorageService';
import { useWatermarkService } from './services/useWatermarkService';
import { usePostService } from './services/usePostService';
import { addCacheBuster } from './utils/urlUtils';

export const useShortPostSubmit = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const session = useSession();
  const { checkColumnExists } = useDbService();
  const { uploadVideoToStorage } = useStorageService();
  const { getUsernameForWatermark } = useWatermarkService();
  const { createPostWithVideo } = usePostService();

  const submitShortPost = async (
    videoFile: File,
    caption: string,
    visibility: 'public' | 'subscribers_only' = 'public',
    tags: string[] = []
  ) => {
    if (!session?.user) {
      setError('You must be logged in to upload videos');
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to upload videos',
        variant: 'destructive',
      });
      return { success: false, error: 'Authentication required' };
    }

    try {
      setError(null);
      setIsUploading(true);
      setUploadProgress(10);

      // Get watermark username
      const watermarkUsername = await getUsernameForWatermark(session.user.id);
      
      // Upload video to storage
      const { videoUrl, error: uploadError } = await uploadVideoToStorage(
        videoFile,
        session.user.id,
        watermarkUsername,
        (progress) => {
          setUploadProgress(10 + progress * 0.6); // 10-70% for upload
        }
      );

      if (uploadError || !videoUrl) {
        throw new Error(uploadError || 'Failed to upload video');
      }

      setUploadProgress(80);
      
      // Add cache buster to video URL to prevent caching issues
      const cacheBustedUrl = addCacheBuster(videoUrl);
      
      // Create post or story with video URL
      const result = await createPostWithVideo({
        userId: session.user.id,
        videoUrl: cacheBustedUrl,
        caption,
        visibility,
        tags
      });

      setUploadProgress(100);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      toast({
        title: 'Upload successful',
        description: 'Your video has been uploaded successfully',
      });
      
      return { success: true, data: result.data };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to upload video';
      console.error('Short post submission error:', err);
      setError(errorMessage);
      toast({
        title: 'Upload Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    submitShortPost,
    isUploading,
    uploadProgress,
    error,
  };
};

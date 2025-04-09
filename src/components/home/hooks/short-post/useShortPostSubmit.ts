
import { useState } from 'react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const session = useSession();
  const { checkColumnExists } = useDbService();
  const { uploadVideoToStorage } = useStorageService();
  const { getUsernameForWatermark } = useWatermarkService();
  const { createPostWithVideo } = usePostService();

  const resetUploadState = () => {
    setIsUploading(false);
    setUploadProgress(0);
    setError(null);
    setIsSubmitting(false);
  };

  const submitShortPost = async (
    videoFile: File,
    caption: string,
    visibility: 'public' | 'subscribers_only' = 'public',
    tags: string[] = []
  ): Promise<{ success: boolean; data?: any; error?: any }> => {
    if (!session?.user) {
      const authError = 'You must be logged in to upload videos';
      setError(authError);
      toast({
        title: 'Authentication Error',
        description: authError,
        variant: 'destructive',
      });
      return { success: false, error: 'Authentication required' };
    }

    try {
      setError(null);
      setIsUploading(true);
      setIsSubmitting(true);
      setUploadProgress(10);

      // Get watermark username
      const watermarkUsername = await getUsernameForWatermark(session.user.id);
      
      // Upload video to storage
      const { path, error: uploadError } = await uploadVideoToStorage(
        session.user.id, 
        videoFile
      );

      if (uploadError || !path) {
        throw new Error(uploadError || 'Failed to upload video');
      }

      setUploadProgress(80);
      
      // Get full public URL from storage path
      const videoUrl = addCacheBuster(`/api/storage/shorts/${path}`);
      
      // Create post or story with video URL
      const result = await createPostWithVideo(
        videoUrl,
        caption
      );
      
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
      setIsSubmitting(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    submitShortPost,
    isUploading,
    uploadProgress,
    error,
    isSubmitting,
    errorMessage: error, // Alias for error for backward compatibility
    resetUploadState,
    isError: !!error, // Computed property for convenience
  };
};

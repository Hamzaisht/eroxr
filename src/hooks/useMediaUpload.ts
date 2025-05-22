
import { useState, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { uploadMediaToSupabase } from '@/utils/media/uploadUtils';
import { useToast } from './use-toast';
import { MediaAccessLevel, UploadOptions, UploadResult } from '@/utils/media/types';

export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  isComplete: boolean;
}

export const useMediaUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const session = useSession();

  // Add uploadState object to match the expected interface
  const uploadState: UploadState = {
    isUploading,
    progress,
    error,
    isComplete: progress === 100 && !isUploading,
  };

  const uploadMedia = useCallback(async (
    file: File,
    options: { contentCategory: string; maxSizeInMB: number }
  ): Promise<UploadResult> => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upload media",
        variant: "destructive"
      });
      return { success: false, error: 'Authentication required' };
    }

    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      const { contentCategory, maxSizeInMB } = options;

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 5, 90));
      }, 300);

      const result = await uploadMediaToSupabase(
        file,
        'media',
        {
          folder: `${session.user.id}/${contentCategory}`,
          maxSizeMB: maxSizeInMB, 
          accessLevel: MediaAccessLevel.PUBLIC
        }
      );

      clearInterval(progressInterval);
      setProgress(100);

      return result;
    } catch (error: any) {
      console.error('Error uploading media:', error);
      setError(error.message || "Failed to upload media");
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload media",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    } finally {
      setIsUploading(false);
    }
  }, [session, toast]);

  return { uploadMedia, isUploading, uploadState };
};

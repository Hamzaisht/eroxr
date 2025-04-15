
import { useMediaUpload } from './useMediaUpload';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { UploadResult } from '@/utils/media/mediaUtils';

type MediaContext = 'post' | 'story' | 'message' | 'short' | 'avatar';

/**
 * Hook for handling contextual media uploads (posts, stories, etc.)
 */
export const useContextualMediaUpload = (context: MediaContext) => {
  const { uploadMedia, uploadState } = useMediaUpload();
  const session = useSession();
  const { toast } = useToast();

  /**
   * Upload a media file in the given context
   */
  const uploadFile = async (file: File): Promise<UploadResult> => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upload media.",
        variant: "destructive"
      });
      return { success: false, error: "Not authenticated" };
    }
    
    try {
      const result = await uploadMedia(file, { contentCategory: context });
      
      if (!result.success) {
        toast({
          title: "Upload Failed",
          description: "Could not upload your media file.",
          variant: "destructive"
        });
        return result;
      }
      
      toast({
        title: "Upload Complete",
        description: "Your media has been uploaded successfully."
      });
      
      return result;
    } catch (error: any) {
      toast({
        title: "Upload Error",
        description: error.message || "An error occurred during upload.",
        variant: "destructive"
      });
      return { success: false, error: error.message || "Unknown error" };
    }
  };

  return {
    uploadFile,
    isUploading: uploadState.isUploading,
    progress: uploadState.progress,
    error: uploadState.error
  };
};

import { useState, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { uploadMediaToSupabase } from '@/utils/media/uploadUtils';
import { useToast } from './use-toast';
import { MediaAccessLevel } from '@/utils/media/types';

export const useMediaUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const session = useSession();

  const uploadMedia = useCallback(async (
    file: File,
    options: { contentCategory: string; maxSizeInMB: number }
  ) => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upload media",
        variant: "destructive"
      });
      return { success: false, error: 'Authentication required' };
    }

    setIsUploading(true);

    try {
      const { contentCategory, maxSizeInMB } = options;

      const result = await uploadMediaToSupabase(
        file,
        'media',
        {
          folder: `${session.user.id}/${contentCategory}`,
          maxSizeMB: maxSizeInMB,
          accessLevel: MediaAccessLevel.PUBLIC
        }
      );

      return result;
    } catch (error: any) {
      console.error('Error uploading media:', error);
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

  return { uploadMedia, isUploading };
};

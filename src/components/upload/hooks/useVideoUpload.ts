
import { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { useUniversalUpload } from '@/hooks/useUniversalUpload';
import { MediaAccessLevel } from '@/utils/media/types';

export const useVideoUpload = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { upload, isUploading, progress, error } = useUniversalUpload();
  const session = useSession();
  const { toast } = useToast();

  const uploadVideo = async (
    file: File, 
    title: string, 
    description: string,
    accessLevel: MediaAccessLevel = MediaAccessLevel.PUBLIC,
    ppvAmount?: number
  ) => {
    if (!session?.user?.id) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to upload videos',
        variant: 'destructive'
      });
      return { success: false, error: 'Authentication required' };
    }

    setIsSubmitting(true);

    try {
      const result = await upload(file, {
        accessLevel,
        category: 'shorts',
        metadata: {
          title,
          description,
          ppvAmount: accessLevel === MediaAccessLevel.PPV ? ppvAmount : undefined
        }
      });

      if (result.success) {
        toast({
          title: 'Video uploaded',
          description: 'Your video has been uploaded successfully'
        });
      }

      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to upload video';
      toast({
        title: 'Upload failed',
        description: errorMessage,
        variant: 'destructive'
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    uploadVideo,
    isUploading: isUploading || isSubmitting,
    progress,
    error
  };
};

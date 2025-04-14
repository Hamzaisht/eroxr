
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSession } from '@supabase/auth-helpers-react';
import { uploadFileToStorage } from '@/utils/mediaUtils';
import { useStories } from '@/components/story/hooks/useStories';
import { isImageFile, isVideoFile } from '@/utils/mediaUtils';
import { useMediaUpload } from '@/hooks/useMediaUpload';

export const useStoryUpload = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const session = useSession();
  const { uploadStory } = useStories();

  const { 
    state: uploadState, 
    uploadMedia, 
    validateFile,
    resetState 
  } = useMediaUpload({
    contentCategory: 'story',
    maxSizeInMB: 100,
    allowedTypes: [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'
    ],
    autoResetOnCompletion: true,
    resetDelay: 1500
  });

  // Clear state and preview
  const resetStateHandler = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    resetState();
  }, [previewUrl, resetState]);

  // Create preview for selected file
  const createPreview = useCallback((file: File): string => {
    try {
      return URL.createObjectURL(file);
    } catch (err) {
      console.error('Error creating preview:', err);
      return '';
    }
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback(async (file: File) => {
    try {
      // Reset any previous state
      resetStateHandler();
      
      // Validate file
      const validationResult = validateFile(file);
      if (!validationResult.valid) {
        toast({
          title: 'Invalid file',
          description: validationResult.message || 'The selected file cannot be used for stories',
          variant: 'destructive',
        });
        return false;
      }
      
      // Create preview
      const preview = createPreview(file);
      setPreviewUrl(preview);
      
      return true;
    } catch (err) {
      console.error('Error processing file:', err);
      toast({
        title: 'Error',
        description: 'Failed to process the selected file',
        variant: 'destructive',
      });
      return false;
    }
  }, [resetStateHandler, validateFile, createPreview, toast]);

  // Upload story
  const uploadFile = useCallback(async (file: File) => {
    if (!session?.user?.id) {
      toast({
        title: 'Authentication required',
        description: 'You need to be logged in to upload stories',
        variant: 'destructive',
      });
      return { success: false, error: 'Authentication required' };
    }

    try {
      // Determine if file is video
      const isVideo = isVideoFile(file);
      
      // Upload using the stories hook
      const result = await uploadStory(file, { isVideo });
      
      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }
      
      toast({
        title: 'Story uploaded',
        description: 'Your story has been uploaded successfully',
      });
      
      setTimeout(resetStateHandler, 1500);
      
      return result;
    } catch (err: any) {
      console.error('Story upload error:', err);
      
      toast({
        title: 'Upload failed',
        description: err.message || 'There was a problem uploading your story',
        variant: 'destructive',
      });
      
      return { success: false, error: err.message };
    }
  }, [session, toast, resetStateHandler, uploadStory]);

  return {
    isUploading: uploadState.isUploading,
    progress: uploadState.progress,
    error: uploadState.error,
    previewUrl,
    handleFileSelect,
    uploadFile,
    resetState: resetStateHandler
  };
};

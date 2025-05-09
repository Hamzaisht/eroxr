
import { useState, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { useStories } from '@/components/story/hooks/useStories';
import { isImageFile, isVideoFile, validateFileForUpload } from '@/utils/upload/validators';
import { createFilePreview, revokeFilePreview } from '@/utils/upload/fileUtils';

export const useStoryUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const session = useSession();
  const { uploadStory } = useStories();

  // Clear state and preview
  const resetState = useCallback(() => {
    if (previewUrl) {
      revokeFilePreview(previewUrl);
    }
    setIsUploading(false);
    setProgress(0);
    setError(null);
    setPreviewUrl(null);
  }, [previewUrl]);

  // Validate file before upload
  const validateFile = useCallback((file: File): { valid: boolean; message?: string } => {
    // Basic validation
    const validation = validateFileForUpload(file);
    if (!validation.valid) {
      return validation;
    }
    
    // Check if file is an image or video
    if (!isImageFile(file) && !isVideoFile(file)) {
      return { 
        valid: false, 
        message: 'Only image and video files are allowed for stories' 
      };
    }
    
    // Check file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return { 
        valid: false, 
        message: `File is too large. Maximum size is 100MB` 
      };
    }
    
    return { valid: true };
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback(async (file: File) => {
    try {
      // Reset any previous state
      resetState();
      
      // Validate file
      const validationResult = validateFile(file);
      if (!validationResult.valid) {
        setError(validationResult.message || 'Invalid file');
        toast({
          title: 'Invalid file',
          description: validationResult.message || 'The selected file cannot be used for stories',
          variant: 'destructive',
        });
        return false;
      }
      
      // Create preview
      const preview = createFilePreview(file);
      setPreviewUrl(preview);
      
      return true;
    } catch (err) {
      console.error('Error processing file:', err);
      setError('Error processing file');
      return false;
    }
  }, [resetState, validateFile, toast]);

  // Upload story
  const uploadFile = useCallback(async (file: File) => {
    if (!session?.user?.id) {
      setError('You must be logged in to upload stories');
      toast({
        title: 'Authentication required',
        description: 'You need to be logged in to upload stories',
        variant: 'destructive',
      });
      return { success: false, error: 'Authentication required' };
    }

    // Final validation before upload
    const validation = validateFileForUpload(file);
    if (!validation.valid) {
      setError(validation.message || 'Invalid file');
      toast({
        title: 'Invalid file',
        description: validation.message || 'The selected file is not valid',
        variant: 'destructive',
      });
      return { success: false, error: validation.message };
    }

    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Start progress simulation
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 5, 90));
      }, 200);
      
      // Upload using the stories hook
      const result = await uploadStory(file);
      
      clearInterval(progressInterval);
      
      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }
      
      // Complete progress
      setProgress(100);
      
      toast({
        title: 'Story uploaded',
        description: 'Your story has been uploaded successfully',
      });
      
      setTimeout(resetState, 1500);
      
      return result;
    } catch (err: any) {
      console.error('Story upload error:', err);
      setError(err.message || 'Failed to upload story');
      
      toast({
        title: 'Upload failed',
        description: err.message || 'There was a problem uploading your story',
        variant: 'destructive',
      });
      
      return { success: false, error: err.message };
    } finally {
      setIsUploading(false);
    }
  }, [session, toast, resetState, uploadStory]);

  return {
    isUploading,
    progress,
    error,
    previewUrl,
    handleFileSelect,
    uploadFile,
    resetState
  };
};

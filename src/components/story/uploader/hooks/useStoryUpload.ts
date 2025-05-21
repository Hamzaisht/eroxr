
import { useState, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { useStories } from '@/components/story/hooks/useStories';
import { isImageFile, isVideoFile, validateFileForUpload } from '@/utils/upload/validators';
import { createFilePreview, revokeFilePreview, runFileDiagnostic } from '@/utils/upload/fileUtils';

export const useStoryUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setIsSubmitting(false);
    setProgress(0);
    setError(null);
    setPreviewUrl(null);
  }, [previewUrl]);

  // Validate file before upload
  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    // CRITICAL: Run comprehensive file diagnostic
    runFileDiagnostic(file);
    
    // CRITICAL: Strict file validation
    if (!file || !(file instanceof File) || file.size === 0) {
      console.error("❌ Invalid File passed to uploader", file);
      return { 
        valid: false, 
        error: "Only raw File instances with data can be uploaded"
      };
    }
    
    // Basic validation
    const validation = validateFileForUpload(file);
    if (!validation.valid) {
      return validation;
    }
    
    // Check if file is an image or video
    if (!isImageFile(file) && !isVideoFile(file)) {
      return { 
        valid: false, 
        error: 'Only image and video files are allowed for stories' 
      };
    }
    
    // Check file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return { 
        valid: false, 
        error: `File is too large. Maximum size is 100MB` 
      };
    }
    
    return { valid: true };
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback(async (file: File) => {
    try {
      // Reset any previous state
      resetState();
      
      // CRITICAL: Run comprehensive file diagnostic
      runFileDiagnostic(file);
      
      // Validate file
      const validationResult = validateFile(file);
      if (!validationResult.valid) {
        setError(validationResult.error || 'Invalid file');
        toast({
          title: 'Invalid file',
          description: validationResult.error || 'The selected file cannot be used for stories',
          variant: 'destructive',
        });
        return false;
      }
      
      // Create preview - FIX: Await the Promise before setting state
      try {
        const preview = await createFilePreview(file);
        setPreviewUrl(preview);
      } catch (previewErr) {
        console.error('Failed to generate preview:', previewErr);
      }
      
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

    // CRITICAL: Run comprehensive file diagnostic
    runFileDiagnostic(file);
    
    // CRITICAL: Strict file validation
    if (!file || !(file instanceof File) || file.size === 0) {
      const errorMessage = "Only raw File instances with data can be uploaded";
      console.error("❌ Invalid File passed to uploader", file);
      setError(errorMessage);
      toast({
        title: 'Invalid file',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false, error: errorMessage };
    }

    // Final validation before upload
    const validation = validateFileForUpload(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      toast({
        title: 'Invalid file',
        description: validation.error || 'The selected file is not valid',
        variant: 'destructive',
      });
      return { success: false, error: validation.error };
    }

    setIsUploading(true);
    setIsSubmitting(true);
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
      setIsSubmitting(false);
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

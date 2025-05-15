
import { useState, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { createUniqueFilePath } from '@/utils/media/mediaUtils';
import { validateFileForUpload } from '@/utils/upload/validators';
import { uploadFileToStorage } from '@/utils/upload/storageService';
import { UploadOptions } from '@/utils/media/types';

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  isComplete: boolean;
}

export const useMediaUpload = (defaultOptions?: UploadOptions) => {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    isComplete: false
  });
  
  const session = useSession();
  const { toast } = useToast();
  
  // Reset upload state
  const resetUploadState = useCallback(() => {
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
      isComplete: false
    });
  }, []);
  
  // Validate file before upload
  const validateFile = useCallback((file: File, options?: UploadOptions) => {
    const maxSizeInMB = options?.maxSizeInMB || defaultOptions?.maxSizeInMB || 100;
    return validateFileForUpload(file, maxSizeInMB);
  }, [defaultOptions?.maxSizeInMB]);
  
  // Upload media file
  const uploadMedia = useCallback(async (
    file: File,
    options?: UploadOptions
  ) => {
    if (!session?.user?.id) {
      return { 
        success: false, 
        error: "Authentication required" 
      };
    }
    
    // Combine default options with provided options
    const finalOptions = {
      ...defaultOptions,
      ...options
    };
    
    // Validate file
    const fileValidation = validateFile(file, finalOptions);
    if (!fileValidation.valid) {
      setUploadState(prev => ({
        ...prev,
        error: fileValidation.error || "Invalid file"
      }));
      
      if (fileValidation.error) {
        toast({
          title: "Upload Error",
          description: fileValidation.error,
          variant: "destructive"
        });
      }
      
      return { success: false, error: fileValidation.error };
    }
    
    // Set uploading state
    setUploadState({
      isUploading: true,
      progress: 0,
      error: null,
      isComplete: false
    });
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadState(prev => {
          const newProgress = Math.min(prev.progress + 5, 90);
          
          if (finalOptions?.onProgress) {
            finalOptions.onProgress(newProgress);
          }
          
          return {
            ...prev,
            progress: newProgress
          };
        });
      }, 200);
      
      // Map generic categories to actual bucket names
      let bucketName = finalOptions?.contentCategory || 'media';
      
      // Generate unique file path
      const filePath = createUniqueFilePath(session.user.id, file);
      
      // Upload to storage
      const result = await uploadFileToStorage(bucketName, filePath, file);
      
      // Clear progress interval
      clearInterval(progressInterval);
      
      if (!result.success) {
        throw new Error(result.error || "Upload failed");
      }
      
      // Complete upload
      setUploadState({
        isUploading: false,
        progress: 100,
        error: null,
        isComplete: true
      });
      
      // Auto-reset state after completion if enabled
      if (finalOptions?.autoResetOnCompletion) {
        const delay = finalOptions.resetDelay || 3000;
        setTimeout(resetUploadState, delay);
      }
      
      return result;
    } catch (error: any) {
      console.error("Media upload error:", error);
      
      setUploadState({
        isUploading: false,
        progress: 0,
        error: error.message || "Upload failed",
        isComplete: false
      });
      
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload media",
        variant: "destructive"
      });
      
      return { 
        success: false, 
        error: error.message || "Upload failed" 
      };
    }
  }, [session, toast, validateFile, resetUploadState, defaultOptions]);
  
  return {
    uploadState,
    uploadMedia,
    resetUploadState,
    validateFile
  };
};


import { useState, useCallback } from 'react';
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { validateMediaFile, FileValidationOptions } from '@/utils/upload/validators';
import { uploadFile, UploadOptions } from '@/utils/upload/storageService';
import { getBucketForFileType, getStoragePathForContentType } from '@/utils/upload/fileUtils';

export interface MediaUploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export interface MediaUploadOptions extends FileValidationOptions, UploadOptions {
  /**
   * The type of content being uploaded (used for storage path)
   */
  contentCategory?: 'story' | 'post' | 'message' | 'profile' | 'short' | 'generic';
  
  /**
   * Whether to automatically reset state after upload completes
   */
  autoResetOnCompletion?: boolean;
  
  /**
   * Time in ms to wait before resetting state
   */
  resetDelay?: number;
}

export interface UseMediaUploadReturn {
  /**
   * Current state of the upload
   */
  state: MediaUploadState;
  
  /**
   * Upload a file
   */
  uploadMedia: (file: File) => Promise<{url?: string; success: boolean; error?: string}>;
  
  /**
   * Upload multiple files
   */
  uploadMultiple: (files: File[]) => Promise<{urls: string[]; success: boolean; failed: number}>;
  
  /**
   * Reset the upload state
   */
  resetState: () => void;

  /**
   * Validate a file without uploading
   */
  validateFile: (file: File) => {valid: boolean; message?: string};
}

/**
 * Hook for handling media uploads with progress, validation and error handling
 */
export const useMediaUpload = (options: MediaUploadOptions = {}): UseMediaUploadReturn => {
  const [state, setState] = useState<MediaUploadState>({
    isUploading: false,
    progress: 0,
    error: null
  });
  
  const session = useSession();
  const { toast } = useToast();
  
  // Reset upload state
  const resetState = useCallback(() => {
    setState({
      isUploading: false,
      progress: 0,
      error: null
    });
  }, []);

  // Validate a file
  const validateFile = useCallback((file: File) => {
    return validateMediaFile(file, {
      maxSizeInMB: options.maxSizeInMB,
      minSizeInKB: options.minSizeInKB,
      allowedTypes: options.allowedTypes
    });
  }, [options.maxSizeInMB, options.minSizeInKB, options.allowedTypes]);

  // Upload a single file
  const uploadMedia = useCallback(async (file: File) => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to upload files",
        variant: "destructive"
      });
      return { success: false, error: "Not authenticated" };
    }
    
    try {
      // Reset state
      setState({
        isUploading: true,
        progress: 0,
        error: null
      });
      
      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        setState(prev => ({ ...prev, isUploading: false, error: validation.message }));
        toast({
          title: "Invalid file",
          description: validation.message,
          variant: "destructive"
        });
        return { success: false, error: validation.message };
      }
      
      // Determine storage bucket and path
      const contentType = file.type;
      const bucket = options.bucket || getBucketForFileType(contentType);
      const contentTypeFolder = getStoragePathForContentType(contentType);
      const categoryFolder = options.contentCategory || 'generic';

      // Set up progress tracking
      const updateProgress = (progress: number) => {
        setState(prev => ({ ...prev, progress }));
      };
      
      // Set initial progress
      updateProgress(10);
      
      // Create a progress simulation interval for better UX
      const progressInterval = setInterval(() => {
        setState(prev => {
          if (prev.progress >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return { 
            ...prev, 
            progress: Math.min(90, prev.progress + (Math.random() * 5)) 
          };
        });
      }, 300);

      // Upload file to storage
      const result = await uploadFile(file, session.user.id, {
        ...options,
        bucket,
        path: `${session.user.id}/${categoryFolder}/${contentTypeFolder}/${file.name}`,
        onProgress: updateProgress
      });

      clearInterval(progressInterval);
      
      if (!result.success) {
        setState({
          isUploading: false,
          progress: 0,
          error: result.error || "Upload failed"
        });
        
        toast({
          title: "Upload failed",
          description: result.error || "Failed to upload file",
          variant: "destructive"
        });
        
        return { success: false, error: result.error };
      }

      // Set complete progress
      setState({
        isUploading: false,
        progress: 100,
        error: null
      });
      
      // Auto reset state after completion if enabled
      if (options.autoResetOnCompletion) {
        setTimeout(resetState, options.resetDelay || 3000);
      }
      
      return { 
        success: true, 
        url: result.url
      };
      
    } catch (error: any) {
      console.error('Media upload error:', error);
      
      setState({
        isUploading: false,
        progress: 0,
        error: error.message || "An unexpected error occurred"
      });
      
      toast({
        title: "Upload error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      
      return { success: false, error: error.message };
    }
  }, [session, toast, options, validateFile, resetState]);
  
  // Upload multiple files
  const uploadMultiple = useCallback(async (files: File[]) => {
    if (!files.length) {
      return { success: true, urls: [], failed: 0 };
    }
    
    const results = [];
    let failedCount = 0;
    
    for (const file of files) {
      const result = await uploadMedia(file);
      if (result.success && result.url) {
        results.push(result.url);
      } else {
        failedCount++;
      }
    }
    
    return {
      success: failedCount === 0,
      urls: results,
      failed: failedCount
    };
  }, [uploadMedia]);

  return {
    state,
    uploadMedia,
    uploadMultiple,
    resetState,
    validateFile
  };
};

export default useMediaUpload;

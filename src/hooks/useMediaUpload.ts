
import { useState, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { validateFileForUpload } from '@/utils/upload/validators';
import { uploadMediaToSupabase } from '@/utils/media/uploadUtils';
import { UploadOptions } from '@/utils/media/types';
import { isValidMediaUrl } from '@/utils/media/mediaOrchestrator';

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  isComplete: boolean;
}

interface UploadParams {
  file: File;
  mediaType?: string;
  contentCategory?: string;
  maxSizeInMB?: number;
  onProgress?: (progress: number) => void;
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
  
  // Upload media file - original method kept for backward compatibility
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
      
      // Use the centralized upload utility
      const result = await uploadMediaToSupabase({
        file,
        userId: session.user.id,
        options: {
          bucket: finalOptions?.contentCategory || 'media',
          maxSizeMB: finalOptions?.maxSizeInMB,
          saveMetadata: true
        }
      });
      
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
      
      // Validate URL before returning
      if ('publicUrl' in result && !isValidMediaUrl(result.publicUrl as string)) {
        console.error('Invalid public URL format in upload result:', result);
        throw new Error('Invalid public URL format returned');
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
  
  // New simplified upload method with consistent interface
  const upload = useCallback(async ({ 
    file, 
    mediaType, 
    contentCategory,
    maxSizeInMB,
    onProgress 
  }: UploadParams): Promise<string | null> => {
    if (!file) {
      toast({
        title: "Upload Error",
        description: "No file provided",
        variant: "destructive"
      });
      return null;
    }
    
    // Determine media type from file if not provided
    const detectedMediaType = mediaType || 
      (file.type.startsWith('image/') ? 'image' : 
       file.type.startsWith('video/') ? 'video' :
       file.type.startsWith('audio/') ? 'audio' : 'document');
    
    const bucket = contentCategory || detectedMediaType + 's';
    
    const result = await uploadMedia(file, {
      contentCategory: bucket,
      maxSizeInMB,
      onProgress
    });
    
    // Fix the type checking - access publicUrl or url property safely
    if (result.success) {
      if ('publicUrl' in result) {
        return result.publicUrl as string;
      }
      if ('url' in result) {
        return result.url as string;
      }
    }
    
    return null;
  }, [uploadMedia, toast]);
  
  return {
    uploadState,
    uploadMedia, // Keep for backward compatibility
    upload,      // New simplified method
    resetUploadState,
    validateFile
  };
};

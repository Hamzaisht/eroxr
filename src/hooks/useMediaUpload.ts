
import { useState, useCallback } from 'react';
import { UploadOptions, UploadResult, UploadState, FileValidationResult } from '@/utils/media/types';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from './use-toast';

export const useMediaUpload = (options?: UploadOptions) => {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    success: false,
    isComplete: false
  });

  const session = useSession();
  const { toast } = useToast();

  const validateFile = useCallback((file: File, opts?: UploadOptions): FileValidationResult => {
    if (!file) {
      return { isValid: false, message: 'No file selected' };
    }
    
    // Check file size if max size is provided
    if (opts?.maxSizeInMB) {
      const maxSizeInBytes = opts.maxSizeInMB * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        return {
          isValid: false,
          message: `File is too large. Maximum size is ${opts.maxSizeInMB}MB`
        };
      }
    }
    
    // Check allowed file types if provided
    if (opts?.allowedTypes && opts.allowedTypes.length > 0) {
      const fileType = file.type.toLowerCase();
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      const isAllowedType = opts.allowedTypes.some(type => {
        return fileType.includes(type) || (fileExtension && type.includes(fileExtension));
      });
      
      if (!isAllowedType) {
        return {
          isValid: false,
          message: `Invalid file type. Allowed types: ${opts.allowedTypes.join(', ')}`
        };
      }
    }
    
    return { isValid: true };
  }, []);

  const uploadMedia = useCallback(async (
    file: File,
    customOptions?: UploadOptions
  ): Promise<UploadResult> => {
    if (!session?.user) {
      return { 
        url: '',
        path: '',
        size: 0,
        contentType: '',
        success: false, 
        error: 'User is not authenticated' 
      };
    }

    // Merge default options with custom options
    const mergedOptions = { ...options, ...customOptions };

    const validation = validateFile(file, mergedOptions);
    if (!validation.isValid) {
      toast({
        title: 'Invalid file',
        description: validation.message || '',
        variant: 'destructive',
      });
      return { 
        url: '',
        path: '',
        size: 0,
        contentType: '',
        success: false, 
        error: validation.message || 'Invalid file'
      };
    }

    setUploadState({
      isUploading: true,
      progress: 0,
      error: null,
      success: false,
      isComplete: false
    });

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadState(prev => {
          const newProgress = Math.min(prev.progress + Math.random() * 10, 90);
          if (mergedOptions?.onProgress) {
            mergedOptions.onProgress(newProgress);
          }
          return { ...prev, progress: newProgress };
        });
      }, 300);

      // TODO: Replace with actual upload logic
      // This is just a placeholder for the real implementation
      await new Promise(resolve => setTimeout(resolve, 2000));

      clearInterval(progressInterval);

      const mockUrl = `https://example.com/uploads/${Date.now()}_${file.name}`;

      setUploadState({
        isUploading: false,
        progress: 100,
        error: null,
        success: true,
        isComplete: true
      });

      // Auto reset if needed
      if (mergedOptions?.autoResetOnCompletion) {
        setTimeout(() => {
          setUploadState({
            isUploading: false,
            progress: 0,
            error: null,
            success: false,
            isComplete: false
          });
        }, mergedOptions.resetDelay || 2000);
      }

      return { 
        url: mockUrl, 
        path: `uploads/${file.name}`,
        size: file.size,
        contentType: file.type,
        success: true 
      };
    } catch (error: any) {
      console.error("Media upload error:", error);
      
      const errorMessage = error.message || "Failed to upload media";
      
      setUploadState({
        isUploading: false,
        progress: 0,
        error: errorMessage,
        success: false,
        isComplete: false
      });
      
      toast({
        title: 'Upload Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return { 
        url: '',
        path: '',
        size: 0,
        contentType: '',
        success: false, 
        error: errorMessage
      };
    }
  }, [session, validateFile, toast, options]);

  const resetUploadState = useCallback(() => {
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
      success: false,
      isComplete: false
    });
  }, []);

  return {
    uploadState,
    uploadMedia,
    resetUploadState,
    validateFile
  };
};


import { useState, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { uploadFileToStorage, createUniqueFilePath, UploadOptions, UploadResult, UploadState, FileValidationResult } from "@/utils/media/mediaUtils";

export interface MediaUploadHook {
  uploadMedia: (file: File, options?: UploadOptions) => Promise<UploadResult>;
  uploadState: UploadState;
  resetState: () => void;
  validateFile: (file: File) => FileValidationResult;
}

export const useMediaUpload = (defaultOptions: UploadOptions = {}): MediaUploadHook => {
  const session = useSession();
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    success: false,
    file: null
  });

  // Validate file based on size and type constraints
  const validateFile = useCallback((file: File): FileValidationResult => {
    // Size validation
    const maxSizeInMB = defaultOptions.maxSizeInMB || 100;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    
    if (file.size > maxSizeInBytes) {
      return {
        valid: false,
        message: `File size exceeds the maximum allowed size of ${maxSizeInMB}MB`
      };
    }
    
    // Type validation if allowedTypes are specified
    if (defaultOptions.allowedTypes && defaultOptions.allowedTypes.length > 0) {
      const isAllowedType = defaultOptions.allowedTypes.some(type => {
        if (type.includes('*')) {
          // Handle wildcard mime types like 'image/*'
          const typeGroup = type.split('/')[0];
          return file.type.startsWith(`${typeGroup}/`);
        }
        return file.type === type;
      });
      
      if (!isAllowedType) {
        return {
          valid: false,
          message: 'File type not allowed'
        };
      }
    }
    
    return { valid: true };
  }, [defaultOptions]);

  // Upload media file to storage
  const uploadMedia = useCallback(async (file: File, options?: UploadOptions): Promise<UploadResult> => {
    if (!session?.user) {
      return { success: false, error: 'User not authenticated' };
    }

    const mergedOptions = { ...defaultOptions, ...options };
    
    // Validate the file first
    const validation = validateFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.message };
    }

    try {
      setUploadState({
        isUploading: true,
        progress: 0,
        error: null,
        success: false,
        file: file
      });

      // Determine bucket based on content category
      const contentCategory = mergedOptions.contentCategory || 'generic';
      let bucket = 'media';
      
      switch (contentCategory) {
        case 'story':
          bucket = 'stories';
          break;
        case 'post':
          bucket = 'posts';
          break;
        case 'message':
          bucket = 'messages';
          break;
        case 'profile':
        case 'avatar':
          bucket = 'avatars';
          break;
        case 'short':
          bucket = 'shorts';
          break;
        default:
          bucket = 'media';
      }

      // Create a unique file path
      const filePath = createUniqueFilePath(session.user.id, file);

      // Simulate upload progress
      let progressInterval: NodeJS.Timeout | null = null;
      if (mergedOptions.onProgress) {
        let progress = 0;
        progressInterval = setInterval(() => {
          progress += Math.random() * 10;
          if (progress > 90) progress = 90;
          mergedOptions.onProgress?.(progress);
          setUploadState(prev => ({ ...prev, progress }));
        }, 300);
      }

      // Upload the file - this now returns UploadResult, not just a string
      const result = await uploadFileToStorage(bucket, filePath, file);

      // Clear progress interval
      if (progressInterval) {
        clearInterval(progressInterval);
      }

      // Handle success
      if (result.success && result.url) {
        setUploadState({
          isUploading: false,
          progress: 100,
          error: null,
          success: true,
          file: file
        });
        
        // Auto-reset state after delay if configured
        if (mergedOptions.autoResetOnCompletion) {
          setTimeout(() => resetState(), mergedOptions.resetDelay || 3000);
        }
        
        return result;
      }

      // Handle failure
      setUploadState({
        isUploading: false,
        progress: 0,
        error: result.error || 'Failed to upload file',
        success: false,
        file: file
      });
      
      return { success: false, error: result.error || 'Failed to upload file' };
    } catch (error: any) {
      // Handle error
      setUploadState({
        isUploading: false,
        progress: 0,
        error: error.message || 'Upload failed',
        success: false,
        file: file
      });
      
      return { success: false, error: error.message || 'Upload failed' };
    }
  }, [session, defaultOptions, validateFile]);

  // Reset upload state
  const resetState = useCallback(() => {
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
      success: false,
      file: null
    });
  }, []);

  return {
    uploadMedia,
    uploadState,
    resetState,
    validateFile
  };
};

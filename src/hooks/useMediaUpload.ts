
import { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { createUniqueFilePath, uploadFileToStorage } from '@/utils/media/mediaUtils';

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
}

interface UploadOptions {
  contentCategory?: 'story' | 'post' | 'message' | 'profile' | 'short' | 'generic' | 'avatar';
  onProgress?: (progress: number) => void;
  autoReset?: boolean;
  resetDelay?: number;
  maxSizeInMB?: number;
  allowedTypes?: string[];
}

interface ValidationResult {
  valid: boolean;
  message?: string;
}

/**
 * Hook for handling media uploads
 */
export const useMediaUpload = (defaultOptions: Partial<UploadOptions> = {}) => {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    success: false
  });
  
  const session = useSession();
  
  const resetUploadState = () => {
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
      success: false
    });
  };
  
  /**
   * Validates a file before upload
   */
  const validateFile = (file: File): ValidationResult => {
    // Check file size if specified
    if (defaultOptions.maxSizeInMB) {
      const maxSizeBytes = defaultOptions.maxSizeInMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        return {
          valid: false,
          message: `File size exceeds maximum allowed (${defaultOptions.maxSizeInMB}MB).`
        };
      }
    }
    
    // Check file type if specified
    if (defaultOptions.allowedTypes && defaultOptions.allowedTypes.length > 0) {
      const fileType = file.type;
      if (!defaultOptions.allowedTypes.some(type => fileType.match(type))) {
        return {
          valid: false,
          message: `File type not allowed. Accepted types: ${defaultOptions.allowedTypes.join(', ')}`
        };
      }
    }
    
    return { valid: true };
  };

  /**
   * Uploads media file
   */
  const uploadMedia = async (
    file: File,
    options: Partial<UploadOptions> = {}
  ) => {
    if (!session?.user?.id) {
      const error = "Authentication required to upload media";
      setUploadState(prev => ({ ...prev, error }));
      return { success: false, error };
    }
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    try {
      setUploadState({
        isUploading: true,
        progress: 0,
        error: null,
        success: false
      });
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadState(prev => {
          const newProgress = Math.min(prev.progress + Math.random() * 10, 90);
          
          if (mergedOptions.onProgress) {
            mergedOptions.onProgress(newProgress);
          }
          
          return {
            ...prev,
            progress: newProgress
          };
        });
      }, 200);
      
      // Determine bucket based on content category
      const contentCategory = mergedOptions.contentCategory || 'generic';
      
      let bucket: string;
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
      
      // Create unique file path
      const path = createUniqueFilePath(session.user.id, file);
      
      // Upload file
      const url = await uploadFileToStorage(bucket, path, file);
      
      clearInterval(progressInterval);
      
      if (!url) {
        throw new Error("Failed to upload media");
      }
      
      setUploadState({
        isUploading: false,
        progress: 100,
        error: null,
        success: true
      });
      
      // Auto-reset state if configured
      if (mergedOptions.autoReset) {
        setTimeout(resetUploadState, mergedOptions.resetDelay || 3000);
      }
      
      return { success: true, url };
    } catch (error: any) {
      clearInterval?.(progressInterval);
      
      const errorMessage = error.message || "An error occurred during upload";
      
      setUploadState({
        isUploading: false,
        progress: 0,
        error: errorMessage,
        success: false
      });
      
      return { success: false, error: errorMessage };
    }
  };

  return {
    uploadMedia,
    uploadState,
    resetUploadState,
    validateFile
  };
};

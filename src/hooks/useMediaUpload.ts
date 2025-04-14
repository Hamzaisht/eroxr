
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { uploadFileToStorage, createUniqueFilePath } from "@/utils/mediaUtils";
import { validateFile as validateFileUtil, ValidationResult } from "@/utils/upload/validators";

export interface UploadOptions {
  contentCategory?: 'story' | 'post' | 'message' | 'profile' | 'short' | 'generic' | 'avatar';
  maxSizeInMB?: number;
  allowedTypes?: string[];
  autoResetOnCompletion?: boolean;
  resetDelay?: number;
  onProgress?: (progress: number) => void;
}

export interface UploadState {
  isUploading: boolean;
  progress: number;
  url: string | null;
  error: string | null;
  success: boolean;
}

/**
 * Hook for handling media uploads to Supabase storage
 */
export const useMediaUpload = (options?: UploadOptions) => {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    url: null,
    error: null,
    success: false
  });
  
  const session = useSession();

  /**
   * Validate a file before upload
   */
  const validateFile = (file: File): ValidationResult => {
    // Check file size if maxSize is provided
    if (options?.maxSizeInMB) {
      const maxSizeBytes = options.maxSizeInMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        return {
          valid: false,
          message: `File size exceeds ${options.maxSizeInMB}MB limit`
        };
      }
    }

    // Check file type if allowedTypes is provided
    if (options?.allowedTypes && options.allowedTypes.length > 0) {
      const isAllowedType = options.allowedTypes.some(type => {
        // Handle wildcards like "image/*"
        if (type.endsWith('/*')) {
          const category = type.split('/')[0];
          return file.type.startsWith(category + '/');
        }
        return file.type === type;
      });

      if (!isAllowedType) {
        return {
          valid: false,
          message: `File type not allowed. Allowed types: ${options.allowedTypes.join(', ')}`
        };
      }
    }

    return { valid: true };
  };

  /**
   * Upload a file to storage
   * @param file - The file to upload
   * @param uploadOptions - Options for the upload
   * @returns The public URL of the uploaded file
   */
  const uploadMedia = async (file: File, uploadOptions?: UploadOptions) => {
    if (!session?.user?.id) {
      setUploadState({
        isUploading: false,
        progress: 0,
        url: null,
        error: "User not authenticated",
        success: false
      });
      return {
        success: false,
        url: null,
        error: "User not authenticated"
      };
    }

    try {
      setUploadState({
        isUploading: true,
        progress: 0,
        url: null,
        error: null,
        success: false
      });
      
      // Create a unique file path
      const filePath = createUniqueFilePath(session.user.id, file);
      
      // Determine the bucket name based on content category
      const contentCategory = uploadOptions?.contentCategory || options?.contentCategory || 'generic';
      let bucketName = 'media';
      
      switch (contentCategory) {
        case 'story':
          bucketName = 'stories';
          break;
        case 'post':
          bucketName = 'posts';
          break;
        case 'message':
          bucketName = 'messages';
          break;
        case 'profile':
          bucketName = 'avatars';
          break;
        case 'short':
          bucketName = 'shorts';
          break;
        case 'avatar':
          bucketName = 'avatars';
          break;
        default:
          bucketName = 'media';
      }
      
      // Simulate progress updates (Supabase doesn't support upload progress yet)
      const progressInterval = setInterval(() => {
        setUploadState(prev => {
          const newProgress = Math.min(prev.progress + Math.random() * 10, 90);
          if (uploadOptions?.onProgress) {
            uploadOptions.onProgress(newProgress);
          }
          return {
            ...prev,
            progress: newProgress
          };
        });
      }, 300);
      
      // Upload the file to storage
      const url = await uploadFileToStorage(bucketName, filePath, file);
      
      clearInterval(progressInterval);
      
      if (!url) {
        setUploadState({
          isUploading: false,
          progress: 0,
          url: null,
          error: "Failed to upload file",
          success: false
        });
        return {
          success: false,
          url: null,
          error: "Failed to upload file"
        };
      }
      
      setUploadState({
        isUploading: false,
        progress: 100,
        url: url,
        error: null,
        success: true
      });
      
      // Auto reset state after success if configured
      if (options?.autoResetOnCompletion) {
        setTimeout(() => {
          resetState();
        }, options.resetDelay || 3000);
      }
      
      return {
        success: true, 
        url: url,
        error: null
      };
    } catch (error: any) {
      setUploadState({
        isUploading: false,
        progress: 0,
        url: null,
        error: error.message || "Error uploading file",
        success: false
      });
      return {
        success: false,
        url: null,
        error: error.message || "Error uploading file"
      };
    }
  };
  
  /**
   * Reset upload state
   */
  const resetState = () => {
    setUploadState({
      isUploading: false,
      progress: 0,
      url: null,
      error: null,
      success: false
    });
  };

  return {
    uploadMedia,
    uploadState,
    resetState,
    validateFile
  };
};

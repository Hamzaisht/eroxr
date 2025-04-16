
import { useState, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { UploadOptions, UploadResult, UploadState, FileValidationResult } from "@/utils/media/types";
import { createUniqueFilePath } from "@/utils/media/mediaUtils";

/**
 * Hook for handling media uploads
 */
export function useMediaUpload(defaultOptions: UploadOptions = {}) {
  const session = useSession();
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    success: false,
    file: null
  });

  /**
   * Validate file based on size and type constraints
   */
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

  /**
   * Upload media file to storage
   */
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
        case 'short':
          bucket = 'shorts';
          break;
        case 'avatar':
        case 'profile':
          bucket = 'avatars';
          break;
        default:
          bucket = 'media';
      }

      // Create a unique file path
      const filePath = createUniqueFilePath(session.user.id, file);

      // Track progress if a handler is provided
      const onProgress = mergedOptions.onProgress;
      let lastProgressEvent = 0;
      
      const uploadOptions = {
        cacheControl: '3600',
        upsert: false,
        onUploadProgress: onProgress ? (progress: { percent?: number }) => {
          const percent = progress.percent || 0;
          
          // Only update state if progress has changed significantly to avoid rerenders
          if (percent - lastProgressEvent >= 5) {
            setUploadState(prev => ({
              ...prev,
              progress: percent
            }));
            lastProgressEvent = percent;
            
            if (onProgress) onProgress(percent);
          }
        } : undefined
      };

      // Upload the file
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, uploadOptions);

      if (error) throw error;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      // Update state on success
      setUploadState({
        isUploading: false,
        progress: 100,
        error: null,
        success: true,
        file: file
      });

      // Auto reset if configured
      if (mergedOptions.autoResetOnCompletion) {
        const delay = mergedOptions.resetDelay || 3000;
        setTimeout(() => {
          setUploadState({
            isUploading: false,
            progress: 0,
            error: null,
            success: false,
            file: null
          });
        }, delay);
      }

      return { success: true, url: publicUrl };
    } catch (error: any) {
      console.error("Upload error:", error);
      
      const errorMessage = error.message || "Failed to upload file";
      
      setUploadState({
        isUploading: false,
        progress: 0,
        error: errorMessage,
        success: false,
        file: file
      });
      
      return { success: false, error: errorMessage };
    }
  }, [session, defaultOptions, validateFile]);

  /**
   * Reset upload state
   */
  const resetState = useCallback(() => {
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
      success: false,
      file: null
    });
  }, []);

  return { uploadMedia, uploadState, resetState, validateFile };
}

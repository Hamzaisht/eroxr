
import { useState, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { uploadFileToStorage, createUniqueFilePath } from '@/utils/media/mediaUtils';
import { UploadOptions, UploadState, FileValidationResult } from '@/utils/media/types';
import { useToast } from './use-toast';
import { getSupabaseUrl } from '@/utils/media/supabaseUrlUtils';
import { supabase } from '@/integrations/supabase/client';

// Helper constants for file validation
const MAX_FILE_SIZE_DEFAULT = 50; // MB
const DEFAULT_ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/webm',
  'video/quicktime'
];

export const useMediaUpload = (defaultOptions?: UploadOptions) => {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    result: null,
    files: [],
    previews: [],
    isComplete: false,
    success: false
  });

  const session = useSession();
  const { toast } = useToast();

  // Reset the upload state
  const resetUploadState = useCallback(() => {
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
      result: null,
      files: [],
      previews: [],
      isComplete: false,
      success: false
    });
  }, []);

  // Validate file before upload
  const validateFile = useCallback((
    file: File,
    options?: UploadOptions
  ): FileValidationResult => {
    // CRITICAL: Debug file info
    console.log("FILE DEBUG:", {
      file,
      isFile: file instanceof File,
      type: file?.type,
      size: file?.size,
      name: file?.name
    });
    
    if (!file) {
      const error = 'No file provided';
      return { valid: false, error };
    }
    
    if (!(file instanceof File)) {
      const error = 'Invalid file object';
      return { valid: false, error };
    }

    const maxSizeMB = options?.maxSizeInMB || defaultOptions?.maxSizeInMB || MAX_FILE_SIZE_DEFAULT;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    
    if (file.size > maxSizeBytes) {
      const error = `File size exceeds the ${maxSizeMB}MB limit`;
      return { valid: false, error };
    }

    const allowedTypes = options?.allowedTypes || defaultOptions?.allowedTypes || DEFAULT_ALLOWED_TYPES;
    
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      const error = `File type '${file.type}' is not supported`;
      return { valid: false, error };
    }

    return { valid: true };
  }, [defaultOptions]);

  // Upload media function
  const uploadMedia = useCallback(async (
    file: File,
    options?: UploadOptions
  ) => {
    if (!session?.user?.id) {
      const errorMessage = 'Authentication required to upload files';
      
      toast({
        title: 'Authentication Required',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return { success: false, error: errorMessage };
    }

    const validation = validateFile(file, options);
    if (!validation.valid) {
      toast({
        title: 'Invalid File',
        description: validation.error || 'Invalid file',
        variant: 'destructive',
      });
      
      return { success: false, error: validation.error };
    }

    // Begin upload process
    setUploadState({
      isUploading: true,
      progress: 0,
      error: null,
      result: null,
      files: [],
      previews: [],
      isComplete: false,
      success: false
    });

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setUploadState(prev => {
        // Cap progress at 90% until actual completion
        const newProgress = Math.min(prev.progress + Math.random() * 10, 90);
        
        if (options?.onProgress) {
          options.onProgress(newProgress);
        }
        
        return {
          ...prev,
          progress: newProgress,
        };
      });
    }, 300);

    try {
      const contentCategory = options?.contentCategory || 'media';
      const bucket = contentCategory === 'shorts' ? 'shorts' : 'media';
      
      // Create path for upload
      const path = createUniqueFilePath(session.user.id, file);
      
      console.log("Uploading file:", {
        name: file.name,
        type: file.type,
        size: file.size,
        bucket: bucket,
        path: path
      });
      
      // CRITICAL: Direct Supabase upload with explicit content type
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: true
        });

      clearInterval(progressInterval);
      
      // CRITICAL: Proper error handling
      if (error) {
        console.error("Upload error:", error);
        
        setUploadState({
          isUploading: false,
          progress: 0,
          error: error.message || 'Upload failed',
          result: null,
          files: [],
          previews: [],
          isComplete: false,
          success: false
        });
        
        toast({
          title: 'Upload Failed',
          description: error.message || 'Failed to upload file',
          variant: 'destructive',
        });
        
        return { success: false, error: error.message };
      }
      
      if (!data || !data.path) {
        const errorMsg = "Upload completed but no file path returned";
        console.error(errorMsg);
        
        setUploadState({
          isUploading: false,
          progress: 0,
          error: errorMsg,
          result: null,
          files: [],
          previews: [],
          isComplete: false,
          success: false
        });
        
        return { success: false, error: errorMsg };
      }
      
      // Test the upload with getPublicUrl
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);
      
      console.log("Uploaded URL:", urlData.publicUrl);
      
      // Get URL using our utility
      const { url: mediaUrl } = await getSupabaseUrl(bucket, data.path, { 
        useSignedUrls: true // Change this to false for public buckets
      });
      
      if (!mediaUrl) {
        const errorMsg = "Failed to get media URL";
        console.error(errorMsg);
        
        setUploadState({
          isUploading: false,
          progress: 0,
          error: errorMsg,
          result: null,
          files: [],
          previews: [],
          isComplete: false,
          success: false
        });
        
        return { success: false, error: errorMsg };
      }

      // Upload successful
      setUploadState({
        isUploading: false,
        progress: 100,
        error: null,
        result: { path: data.path, url: mediaUrl },
        files: [],
        previews: [],
        isComplete: true,
        success: true
      });
      
      // Auto-reset if configured
      if (options?.autoResetOnCompletion || defaultOptions?.autoResetOnCompletion) {
        const delay = options?.resetDelay || defaultOptions?.resetDelay || 3000;
        setTimeout(() => {
          resetUploadState();
        }, delay);
      }

      // Return the result with url and path
      return {
        success: true,
        url: mediaUrl || '',
        path: data.path || ''
      };
    } catch (error: any) {
      clearInterval(progressInterval);
      console.error('Upload error:', error);
      
      const errorMessage = error.message || 'An unknown error occurred';
      
      setUploadState({
        isUploading: false,
        progress: 0,
        error: errorMessage,
        result: null,
        files: [],
        previews: [],
        isComplete: false,
        success: false
      });
      
      toast({
        title: 'Upload Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return { success: false, error: errorMessage };
    }
  }, [session, toast, validateFile, resetUploadState, defaultOptions]);

  return {
    uploadMedia,
    uploadState,
    validateFile,
    resetUploadState
  };
};

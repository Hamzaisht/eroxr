
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { createUniqueFilePath, validateMediaFile } from '@/utils/mediaUtils';
import { addCacheBuster } from '@/utils/media/urlUtils';
import { getStoragePublicUrl, ensureBucketExists } from '@/utils/media/storageUtils';
import { useSession } from '@supabase/auth-helpers-react';

export interface MediaUploadOptions {
  contentCategory?: 'story' | 'post' | 'message' | 'profile' | 'short' | 'generic';
  maxSizeInMB?: number;
  allowedTypes?: string[];
  autoResetOnCompletion?: boolean;
  resetDelay?: number;
}

export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
  url: string | null;
  filePath: string | null;
  isComplete?: boolean; // Add this property to fix the type error
}

export const useMediaUpload = (options: MediaUploadOptions = {}) => {
  const {
    contentCategory = 'generic',
    maxSizeInMB = 100,
    allowedTypes = ['image/*', 'video/*'],
    autoResetOnCompletion = false,
    resetDelay = 3000,
  } = options;

  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    success: false,
    url: null,
    filePath: null,
    isComplete: false, // Initialize this property
  });
  
  const { toast } = useToast();
  const session = useSession();
  
  const userId = session?.user?.id;

  // Function to validate a file before upload
  const validateFile = useCallback((file: File) => {
    // Check if file exists
    if (!file) {
      return { valid: false, message: 'No file selected' };
    }
    
    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSizeInMB) {
      return { 
        valid: false, 
        message: `File size exceeds ${maxSizeInMB}MB limit` 
      };
    }
    
    // Check file type
    if (allowedTypes.length > 0) {
      const fileType = file.type;
      const isAllowedType = allowedTypes.some(type => {
        if (type.endsWith('/*')) {
          // Handle wildcards like 'image/*'
          const typePrefix = type.split('/*')[0];
          return fileType.startsWith(`${typePrefix}/`);
        }
        return fileType === type;
      });
      
      if (!isAllowedType) {
        return { 
          valid: false, 
          message: `File type not allowed. Please use: ${allowedTypes.join(', ')}` 
        };
      }
    }
    
    return { valid: true, message: 'File is valid' };
  }, [allowedTypes, maxSizeInMB]);

  // Reset the state to initial values
  const resetState = useCallback(() => {
    setState({
      isUploading: false,
      progress: 0,
      error: null,
      success: false,
      url: null,
      filePath: null,
      isComplete: false,
    });
  }, []);
  
  // Alias for resetState to match expected API
  const resetUploadState = resetState;

  // Determine which bucket to use based on content category
  const getBucketName = useCallback((category: string): string => {
    switch (category) {
      case 'story': return 'stories';
      case 'post': return 'posts';
      case 'profile': return 'avatars';
      case 'short': return 'shorts';
      case 'message': return 'messages';
      default: return 'media';
    }
  }, []);

  // Main upload function
  const uploadMedia = useCallback(async (file: File): Promise<{
    success: boolean;
    url?: string;
    error?: string;
    filePath?: string;
  }> => {
    if (!userId) {
      const errorMsg = "You must be signed in to upload files";
      setState(prev => ({ ...prev, error: errorMsg }));
      toast({
        title: "Authentication required",
        description: errorMsg,
        variant: "destructive"
      });
      return { success: false, error: errorMsg };
    }

    // Validate the file first
    const validation = validateFile(file);
    if (!validation.valid) {
      setState(prev => ({ ...prev, error: validation.message }));
      toast({
        title: "Invalid file",
        description: validation.message,
        variant: "destructive"
      });
      return { success: false, error: validation.message };
    }

    // Reset any previous state
    setState(prev => ({
      ...prev,
      isUploading: true,
      progress: 0,
      error: null,
      success: false,
      url: null,
      isComplete: false
    }));

    // Create a unique file path
    const bucketName = getBucketName(contentCategory);
    
    // Ensure the bucket exists before uploading
    try {
      const bucketExists = await ensureBucketExists(bucketName);
      if (!bucketExists) {
        throw new Error(`Failed to create/access bucket: ${bucketName}`);
      }
    } catch (error: any) {
      const errorMsg = `Storage bucket error: ${error.message || "Unknown error"}`;
      setState(prev => ({ 
        ...prev, 
        isUploading: false, 
        error: errorMsg,
        progress: 0 
      }));
      toast({
        title: "Storage error",
        description: errorMsg,
        variant: "destructive"
      });
      return { success: false, error: errorMsg };
    }
    
    // Using the renamed function from mediaUtils
    const filePath = createUniqueFilePath(userId, file.name);
    
    try {
      // Upload the file with progress tracking
      const { error: uploadError, data } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type // Explicitly set content type
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the URL for the uploaded file
      const fileUrl = getStoragePublicUrl(`${bucketName}/${filePath}`);
      
      if (!fileUrl) {
        throw new Error("Failed to get URL for uploaded file");
      }
      
      // Add cache buster to ensure fresh content
      const cacheBustedUrl = addCacheBuster(fileUrl);
      
      // Update state with success
      setState(prev => ({
        ...prev,
        isUploading: false,
        progress: 100,
        success: true,
        isComplete: true,
        url: cacheBustedUrl,
        filePath: `${bucketName}/${filePath}`
      }));

      toast({
        title: "Upload successful",
        description: "Your file has been uploaded",
      });

      // Auto reset if enabled
      if (autoResetOnCompletion) {
        setTimeout(resetState, resetDelay);
      }

      return { 
        success: true, 
        url: cacheBustedUrl,
        filePath: `${bucketName}/${filePath}`
      };
    } catch (error: any) {
      console.error("Upload error:", error);
      
      const errorMsg = error.message || "Failed to upload file";
      
      setState(prev => ({
        ...prev,
        isUploading: false,
        error: errorMsg,
        progress: 0
      }));

      toast({
        title: "Upload failed",
        description: errorMsg,
        variant: "destructive"
      });

      return { success: false, error: errorMsg };
    }
  }, [
    userId,
    validateFile,
    contentCategory,
    getBucketName,
    toast,
    autoResetOnCompletion,
    resetDelay,
    resetState
  ]);

  return {
    state,
    uploadMedia,
    resetState,
    resetUploadState, // Add this alias for compatibility
    validateFile
  };
};

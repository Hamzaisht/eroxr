
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { uploadFileToStorage, createUniqueFilePath } from "@/utils/mediaUtils";

interface UploadState {
  isUploading: boolean;
  progress: number;
  url: string | null;
  error: string | null;
}

interface UploadOptions {
  bucketName?: string;
  onProgress?: (progress: number) => void;
}

/**
 * Hook for handling media uploads to Supabase storage
 */
export const useMediaUpload = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    url: null,
    error: null
  });
  
  const session = useSession();

  /**
   * Upload a file to storage
   * @param file - The file to upload
   * @param options - Options for the upload
   * @returns The public URL of the uploaded file
   */
  const uploadMedia = async (file: File, options?: UploadOptions): Promise<string | null> => {
    if (!session?.user?.id) {
      setUploadState({
        isUploading: false,
        progress: 0,
        url: null,
        error: "User not authenticated"
      });
      return null;
    }

    try {
      setUploadState({
        isUploading: true,
        progress: 0,
        url: null,
        error: null
      });
      
      // Create a unique file path
      const filePath = createUniqueFilePath(session.user.id, file);
      
      // Determine the bucket name
      const bucketName = options?.bucketName || getBucketNameForContentType(file);
      
      // Simulate progress updates (Supabase doesn't support upload progress yet)
      const progressInterval = setInterval(() => {
        setUploadState(prev => {
          const newProgress = Math.min(prev.progress + Math.random() * 10, 90);
          if (options?.onProgress) {
            options.onProgress(newProgress);
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
          error: "Failed to upload file"
        });
        return null;
      }
      
      setUploadState({
        isUploading: false,
        progress: 100,
        url,
        error: null
      });
      
      return url;
    } catch (error: any) {
      setUploadState({
        isUploading: false,
        progress: 0,
        url: null,
        error: error.message || "Error uploading file"
      });
      return null;
    }
  };
  
  /**
   * Determine the appropriate bucket name based on file type
   */
  const getBucketNameForContentType = (file: File): string => {
    if (file.type.startsWith('video/')) {
      return 'videos';
    }
    return 'media';
  };

  return {
    uploadMedia,
    uploadState,
    resetState: () => setUploadState({
      isUploading: false,
      progress: 0,
      url: null,
      error: null
    })
  };
};

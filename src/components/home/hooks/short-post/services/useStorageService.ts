
import { supabase } from '@/integrations/supabase/client';
import { addCacheBuster } from '../utils/urlUtils';

export const useStorageService = () => {
  /**
   * Gets a public URL for a file in Supabase storage
   */
  const getFullPublicUrl = (bucket: string, path: string): string => {
    if (!path) return '';
    
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    
    if (!data.publicUrl) {
      console.error("Failed to get public URL for", bucket, path);
      return '';
    }
    
    console.log(`Got public URL for ${bucket}/${path}:`, data.publicUrl);
    return data.publicUrl;
  };

  /**
   * Uploads a video file to Supabase storage
   */
  const uploadVideoToStorage = async (
    userId: string, 
    videoFile: File
  ): Promise<{ success: boolean; path?: string; error?: string }> => {
    try {
      const fileExt = videoFile.name.split('.').pop();
      const uniqueId = crypto.randomUUID();
      const fileName = `${userId}/${uniqueId}.${fileExt}`;
      const bucketName = 'shorts';

      console.log("Uploading to path:", fileName, "in bucket:", bucketName);
      console.log("File type:", videoFile.type);
      
      // First upload attempt with explicit content type
      let uploadResult = await supabase.storage
        .from(bucketName)
        .upload(fileName, videoFile, {
          cacheControl: '3600',
          upsert: true,
          contentType: videoFile.type // Explicitly set content type
        });

      let uploadData = uploadResult.data;
      let uploadError = uploadResult.error;

      // Handle upload error with retry
      if (uploadError) {
        console.error("First upload attempt failed:", uploadError);
        
        // Add a small delay before retry
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const retryId = crypto.randomUUID();
        const retryFilePath = `${userId}/retry_${retryId}.${fileExt}`;
        
        console.log("Retrying upload with path:", retryFilePath);
        console.log("Retry with content type:", videoFile.type);
        
        // Retry with slightly different options
        const retryResult = await supabase.storage
          .from(bucketName)
          .upload(retryFilePath, videoFile, {
            cacheControl: '3600',
            upsert: true,
            contentType: videoFile.type
          });
        
        uploadData = retryResult.data;
        uploadError = retryResult.error;
        
        if (uploadError) {
          console.error("Retry upload failed:", uploadError);
          return { 
            success: false, 
            error: `Upload failed after retry: ${uploadError.message}` 
          };
        }
        
        console.log("Retry upload successful");
      }
      
      if (!uploadData || !uploadData.path) {
        return { 
          success: false, 
          error: 'Upload completed but no file path returned'
        };
      }
      
      console.log("Upload successful, path:", uploadData.path);
      
      return { 
        success: true, 
        path: uploadData.path
      };
    } catch (error: any) {
      console.error("Storage upload error:", error);
      return { 
        success: false, 
        error: error.message || "An unknown error occurred during upload"
      };
    }
  };

  return {
    getFullPublicUrl,
    uploadVideoToStorage
  };
};

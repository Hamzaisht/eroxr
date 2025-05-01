
import { supabase } from '@/integrations/supabase/client';
import { getPlayableMediaUrl } from '@/utils/media/urlUtils';
import { createUniqueFilePath } from '@/utils/media/mediaUtils';

export const useStorageService = () => {
  /**
   * Gets a public URL for a file in Supabase storage
   */
  const getFullPublicUrl = (bucket: string, path: string): string => {
    if (!path) return '';
    
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  };

  /**
   * Uploads a video file to Supabase storage
   */
  const uploadVideoToStorage = async (
    userId: string, 
    videoFile: File
  ): Promise<{ success: boolean; path?: string; url?: string; error?: string }> => {
    try {
      // Use utility function to create a unique file path
      const filePath = createUniqueFilePath(userId, videoFile);
      const bucketName = 'shorts';

      console.log("Uploading to path:", filePath, "in bucket:", bucketName);
      console.log("File type:", videoFile.type);
      
      // First upload attempt with explicit content type
      let uploadResult = await supabase.storage
        .from(bucketName)
        .upload(filePath, videoFile, {
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
        
        // Generate a new unique path for retry
        const retryFilePath = createUniqueFilePath(userId, videoFile);
        
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
      
      // Generate the full public URL using Supabase's getPublicUrl method
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(uploadData.path);
        
      console.log("Public URL:", publicUrl);
      
      // Use our utility to add cache busting as needed
      const processedUrl = getPlayableMediaUrl(publicUrl);
      
      return { 
        success: true, 
        path: uploadData.path,
        url: processedUrl
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


import { supabase } from '@/integrations/supabase/client';
import { getPlayableMediaUrl } from '@/utils/media/urlUtils';
import { createUniqueFilePath } from '@/utils/media/mediaUtils';
import { getSupabaseUrl } from '@/utils/media/supabaseUrlUtils';

export const useStorageService = () => {
  /**
   * Gets a public URL for a file in Supabase storage
   */
  const getFullPublicUrl = async (bucket: string, path: string): Promise<string> => {
    if (!path) return '';
    
    // Use our utility function for getting URLs
    const result = await getSupabaseUrl(bucket, path, {
      useSignedUrls: true // Change this to false for public buckets
    });
    
    if (result.error) {
      console.error("Error getting URL:", result.error);
    }
    
    return result.url || '';
  };

  /**
   * Uploads a video file to Supabase storage
   */
  const uploadVideoToStorage = async (
    userId: string, 
    videoFile: File
  ): Promise<{ success: boolean; path?: string; url?: string; error?: string }> => {
    try {
      // Debug file info
      console.log("FILE DEBUG:", {
        file: videoFile,
        isFile: videoFile instanceof File,
        type: videoFile?.type,
        size: videoFile?.size,
        name: videoFile?.name
      });
      
      // Validate file
      if (!(videoFile instanceof File)) {
        return { 
          success: false, 
          error: 'Invalid file object'
        };
      }
      
      // Validate content type
      const contentType = videoFile.type;
      const isValidVideo = contentType.startsWith("video/");
      
      if (!isValidVideo) {
        return { 
          success: false, 
          error: `Invalid file type: ${contentType}. Only videos are allowed.` 
        };
      }
      
      // Use utility function to create a unique file path
      const filePath = createUniqueFilePath(userId, videoFile);
      const bucketName = 'shorts';

      console.log("Uploading to path:", filePath, "in bucket:", bucketName);
      console.log("File type:", videoFile.type);
      
      // Upload with explicit content type
      const uploadResult = await supabase.storage
        .from(bucketName)
        .upload(filePath, videoFile, {
          cacheControl: '3600',
          upsert: true,
          contentType: contentType
        });

      const uploadData = uploadResult.data;
      const uploadError = uploadResult.error;

      // Handle upload error
      if (uploadError) {
        console.error("Upload failed:", uploadError);
        return { 
          success: false, 
          error: `Upload failed: ${uploadError.message}` 
        };
      }
      
      if (!uploadData || !uploadData.path) {
        return { 
          success: false, 
          error: 'Upload completed but no file path returned'
        };
      }
      
      console.log("Upload successful, path:", uploadData.path);
      
      // Use our utility to get the URL (supports both signed and public URLs)
      const urlResult = await getSupabaseUrl(bucketName, uploadData.path, {
        useSignedUrls: true // Change to false for public buckets
      });
        
      console.log("Media URL:", urlResult.url);
      
      // Use our utility to add cache busting as needed
      const processedUrl = urlResult.url ? getPlayableMediaUrl(urlResult.url) : '';
      
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

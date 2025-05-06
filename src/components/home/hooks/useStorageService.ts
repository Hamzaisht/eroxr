
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

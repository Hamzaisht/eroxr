import { supabase } from "@/integrations/supabase/client";
import { createUniqueFilePath } from "@/utils/media/mediaUtils";
import { inferContentTypeFromExtension } from "@/utils/media/formatUtils";
import { addCacheBuster } from "@/utils/media/urlUtils";

interface FileUploadOptions {
  contentType?: string;
  upsert?: boolean;
  onProgress?: (progress: number) => void;
}

interface FileUploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

/**
 * Upload a file to Supabase storage
 * 
 * @param file The file to upload
 * @param bucket The storage bucket name
 * @param userId The user ID (for creating paths)
 * @param options Upload options
 * @returns Upload result with URL or error
 */
export const uploadFile = async (
  file: File,
  bucket: string,
  userId: string,
  options?: FileUploadOptions
): Promise<FileUploadResult> => {
  if (!file) {
    return { success: false, error: "No file provided" };
  }
  
  try {
    // Create a unique file path
    const filePath = createUniqueFilePath(userId, file);
    
    // Determine content type
    const contentType = options?.contentType || file.type || inferContentTypeFromExtension(file.name);
    
    console.log(`Uploading ${file.name} (${contentType}) to ${bucket}/${filePath}`);
    
    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        contentType,
        cacheControl: '3600',
        upsert: options?.upsert ?? false
      });
      
    if (error) {
      console.error("Storage upload error:", error);
      return { 
        success: false, 
        error: error.message || "Upload failed"
      };
    }
    
    if (!data || !data.path) {
      return { 
        success: false, 
        error: "Upload succeeded but no path returned"
      };
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
      
    // Add cache buster
    const publicUrl = addCacheBuster(urlData.publicUrl);
    
    return {
      success: true,
      url: publicUrl,
      path: data.path
    };
  } catch (error: any) {
    console.error("File upload error:", error);
    return {
      success: false,
      error: error.message || "An unknown error occurred"
    };
  }
};

/**
 * Create a local preview URL for a file
 * 
 * @param file File to create preview for
 * @returns Local URL for preview
 */
export const createLocalPreview = (file: File): string => {
  try {
    return URL.createObjectURL(file);
  } catch (error) {
    console.error("Error creating preview URL:", error);
    return "";
  }
};

/**
 * Revoke a local preview URL
 * 
 * @param url URL to revoke
 */
export const revokeLocalPreview = (url: string): void => {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

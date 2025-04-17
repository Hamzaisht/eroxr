
import { nanoid } from 'nanoid';
import { supabase } from "@/integrations/supabase/client";

/**
 * Creates a unique file path for storage
 * 
 * @param userId User ID to include in the path
 * @param file File to create path for
 * @returns Unique file path
 */
export const createUniqueFilePath = (userId: string, file: File): string => {
  const timestamp = Date.now();
  const uniqueId = nanoid(8);
  const fileExtension = getFileExtension(file.name);
  
  return `${userId}/${timestamp}-${uniqueId}.${fileExtension}`;
};

/**
 * Gets the file extension from a filename
 * 
 * @param filename Filename to get extension from
 * @returns File extension without the dot
 */
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

/**
 * Uploads a file to Supabase storage
 * 
 * @param bucket Bucket name
 * @param path File path
 * @param file File to upload
 * @param options Upload options
 * @returns Upload result
 */
export const uploadFileToStorage = async (
  bucket: string,
  path: string,
  file: File,
  options?: {
    contentType?: string;
    upsert?: boolean;
  }
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    const contentType = options?.contentType || file.type;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType,
        upsert: options?.upsert ?? false,
        cacheControl: '3600'
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
      
    return {
      success: true,
      url: urlData.publicUrl
    };
  } catch (error: any) {
    console.error("File upload error:", error);
    return {
      success: false,
      error: error.message || "An unknown error occurred"
    };
  }
};

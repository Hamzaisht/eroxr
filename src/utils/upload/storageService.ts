
import { supabase } from "@/integrations/supabase/client";
import { createUniqueFilePath } from "../mediaUtils";

/**
 * Upload a file to a specific storage bucket
 */
export const uploadToBucket = async (
  bucketName: string,
  file: File,
  userId: string
): Promise<{ success: boolean; path?: string; url?: string; error?: string }> => {
  try {
    // Create a unique file path in the bucket
    const filePath = createUniqueFilePath(userId, file);
    
    // Upload the file to the bucket
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        contentType: file.type || 'application/octet-stream',
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error(`Error uploading to ${bucketName}:`, error);
      return { 
        success: false,
        error: error.message
      };
    }
    
    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);
    
    return {
      success: true,
      path: data.path,
      url: publicUrl
    };
  } catch (error: any) {
    console.error(`Error in uploadToBucket (${bucketName}):`, error);
    return {
      success: false,
      error: error.message || 'An unknown error occurred'
    };
  }
};

/**
 * Delete a file from storage
 */
export const deleteFromStorage = async (
  bucketName: string, 
  filePath: string
): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
    
    if (error) {
      console.error('Error deleting from storage:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteFromStorage:', error);
    return false;
  }
};

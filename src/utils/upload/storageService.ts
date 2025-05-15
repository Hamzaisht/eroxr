
import { supabase } from "@/integrations/supabase/client";
import { createUniqueFilePath } from "./fileUtils";

/**
 * Uploads a file to Supabase storage
 */
export const uploadFileToStorage = async (
  bucket: string,
  path: string,
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // Validate file
    if (!file || !(file instanceof File) || file.size === 0) {
      return {
        success: false,
        error: "Invalid file object"
      };
    }
    
    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType: file.type,
        upsert: true
      });
      
    if (error) {
      console.error("Storage upload error:", error);
      return {
        success: false,
        error: error.message
      };
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data!.path);
      
    return {
      success: true,
      url: urlData.publicUrl
    };
  } catch (error: any) {
    console.error("Storage upload error:", error);
    return {
      success: false,
      error: error.message || "Unknown error during upload"
    };
  }
};

/**
 * Deletes a file from Supabase storage
 */
export const deleteFileFromStorage = async (
  bucket: string,
  path: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
      
    if (error) {
      return {
        success: false,
        error: error.message
      };
    }
    
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Unknown error during deletion"
    };
  }
};

/**
 * Lists files in a Supabase storage bucket folder
 */
export const listFiles = async (
  bucket: string,
  folder: string
): Promise<{ success: boolean; files?: any[]; error?: string }> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder);
      
    if (error) {
      return {
        success: false,
        error: error.message
      };
    }
    
    return {
      success: true,
      files: data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Unknown error listing files"
    };
  }
};

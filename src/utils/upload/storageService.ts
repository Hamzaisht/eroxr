
import { supabase } from "@/integrations/supabase/client";
import { validateFileForUpload } from "./validators";
import { getFileExtension } from "@/utils/media/mediaUtils";
import { v4 as uuidv4 } from 'uuid';

/**
 * Create a unique file path for upload
 */
function createUniqueFilePath(userId: string, file: File): string {
  const extension = getFileExtension(file);
  const timestamp = Date.now();
  const uniqueId = uuidv4().substring(0, 8);
  
  return `${userId}/${timestamp}-${uniqueId}.${extension}`;
}

/**
 * Upload a file to Supabase storage
 */
export async function uploadFileToStorage(
  bucket: string,
  path: string | null,
  file: File
): Promise<{ success: boolean; url?: string; path?: string; error?: string }> {
  try {
    // Validate the file
    const validation = validateFileForUpload(file);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error
      };
    }

    // If no path provided, create one
    const filePath = path || createUniqueFilePath('uploads', file);

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        contentType: file.type,
        upsert: true
      });

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    if (!data) {
      return {
        success: false,
        error: 'Upload failed with no data returned'
      };
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      success: true,
      path: data.path,
      url: urlData.publicUrl
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'An unknown error occurred'
    };
  }
}

/**
 * Delete a file from Supabase storage
 */
export async function deleteFileFromStorage(
  bucket: string,
  path: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'An unknown error occurred'
    };
  }
}

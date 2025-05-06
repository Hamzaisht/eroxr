
import { supabase } from "@/integrations/supabase/client";
import { inferContentTypeFromExtension } from "../media/formatUtils";
import { getSupabaseUrl } from "../media/supabaseUrlUtils";

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload a file to Supabase storage
 * @param file File to upload
 * @param bucket Storage bucket name
 * @param path Path within bucket
 * @param options Upload options
 * @returns Upload result with URL or error
 */
export const uploadToStorage = async (
  file: File,
  bucket: string,
  path: string,
  options?: {
    contentType?: string;
    upsert?: boolean;
    onProgress?: (progress: number) => void;
  }
): Promise<UploadResult> => {
  try {
    // Determine content type based on file extension if not provided
    const contentType = options?.contentType || file.type || inferContentTypeFromExtension(file.name);
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType,
        upsert: options?.upsert ?? true
      });

    if (error) {
      console.error('Storage upload error:', error);
      return { success: false, error: error.message };
    }

    // Get the URL using our new utility
    const { url: mediaUrl, error: urlError } = await getSupabaseUrl(bucket, data?.path || path, {
      useSignedUrls: true // Change this to false for public buckets
    });
    
    if (urlError) {
      console.warn("Warning getting URL:", urlError);
    }
    
    if (!mediaUrl) {
      return {
        success: false,
        error: "Failed to get media URL"
      };
    }

    return { success: true, url: mediaUrl };
  } catch (error: any) {
    console.error('File upload error:', error);
    return { 
      success: false, 
      error: error.message || 'An unknown error occurred during upload'
    };
  }
};

/**
 * Download a file from storage
 * @param bucket Storage bucket name
 * @param path Path within bucket
 * @returns The file or error
 */
export const downloadFromStorage = async (
  bucket: string,
  path: string
): Promise<{ success: boolean; data?: Blob; error?: string }> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path);

    if (error) {
      console.error('Download error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Download error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to download file'
    };
  }
};

/**
 * Delete a file from storage
 * @param bucket Storage bucket name
 * @param path Path within bucket
 * @returns Success status
 */
export const deleteFromStorage = async (
  bucket: string,
  path: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Delete error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to delete file'
    };
  }
};

/**
 * Get a public URL for a stored file
 * @param bucket Storage bucket name
 * @param path Path within bucket
 * @returns Public URL string
 */
export const getPublicUrl = async (bucket: string, path: string): Promise<string> => {
  const { url } = await getSupabaseUrl(bucket, path, {
    useSignedUrls: true // Change this to false for public buckets
  });
  
  return url || '';
};

/**
 * List all files in a bucket path
 * @param bucket Storage bucket name
 * @param path Path prefix within bucket
 * @returns List of files
 */
export const listFiles = async (
  bucket: string,
  path?: string
): Promise<{ success: boolean; files?: any[]; error?: string }> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path || '');

    if (error) {
      console.error('List error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, files: data };
  } catch (error: any) {
    console.error('List error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to list files'
    };
  }
};

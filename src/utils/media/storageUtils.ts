
import { supabase } from "@/integrations/supabase/client";
import { getSupabaseUrl } from "@/utils/media/supabaseUrlUtils";

/**
 * Gets the public URL for a file in Supabase Storage
 * @param bucket The storage bucket name
 * @param path The file path within the bucket
 * @returns The public URL for the file
 */
export async function getStoragePublicUrl(bucket: string, path: string): Promise<string | null> {
  try {
    const { url, error } = await getSupabaseUrl(bucket, path, {
      useSignedUrls: true // Change this to false for public buckets
    });
    
    if (error) {
      console.error(`Error getting URL for ${bucket}/${path}:`, error);
    }
    
    return url;
  } catch (error) {
    console.error(`Error getting public URL for ${bucket}/${path}:`, error);
    return null;
  }
}

/**
 * Checks if a file exists in Supabase Storage
 * @param bucket The storage bucket name
 * @param path The file path to check
 * @returns True if the file exists, false otherwise
 */
export async function checkFileExists(bucket: string, path: string): Promise<boolean> {
  try {
    // Get the folder path
    const folderPath = path.split('/').slice(0, -1).join('/');
    const fileName = path.split('/').pop();
    
    // List files in the folder and check if our file exists
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folderPath, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      });
    
    if (error) {
      console.error(`Error checking if file exists ${bucket}/${path}:`, error);
      return false;
    }
    
    return data.some(item => item.name === fileName);
  } catch (error) {
    console.error(`Exception checking if file exists ${bucket}/${path}:`, error);
    return false;
  }
}

/**
 * Updates a file in Supabase Storage
 * @param bucket The storage bucket name
 * @param path The file path
 * @param file The file to upload
 * @param options Additional options for the update
 * @returns True if the update succeeded, false otherwise
 */
export async function updateStorageFile(
  bucket: string, 
  path: string, 
  file: File,
  options?: {
    contentType?: string;
    cacheControl?: string;
  }
): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .update(path, file, {
        contentType: options?.contentType || file.type,
        cacheControl: options?.cacheControl || '3600',
        upsert: true
      });
    
    if (error) {
      console.error(`Error updating file ${bucket}/${path}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Exception updating file ${bucket}/${path}:`, error);
    return false;
  }
}

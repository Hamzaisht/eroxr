
// Re-export functions from nested modules
export { 
  uploadFileToStorage, 
  createUniqueFilePath, 
  determineMediaType,
  extractMediaUrl,
  optimizeImage,
  createVideoThumbnail
} from './media/mediaUtils';

// Ensure we export getPlayableMediaUrl correctly
export { getPlayableMediaUrl } from './media/urlUtils';

// Implement missing functions for file storage operations
/**
 * Get a file from storage with proper error handling
 * @param bucket - The storage bucket name
 * @param path - The file path within the bucket
 * @returns Promise resolving to the file or null on error
 */
export const getFileFromStorage = async (bucket: string, path: string) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path);
    
    if (error) {
      console.error('Error fetching file from storage:', error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Unexpected error getting file from storage:', err);
    return null;
  }
};

/**
 * Delete a file from storage with proper error handling
 * @param bucket - The storage bucket name
 * @param path - The file path within the bucket
 * @returns Promise resolving to a boolean indicating success
 */
export const deleteFileFromStorage = async (bucket: string, path: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) {
      console.error('Error deleting file from storage:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Unexpected error deleting file from storage:', err);
    return false;
  }
};

// Import Supabase client
import { supabase } from '@/integrations/supabase/client';

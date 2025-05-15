
import { supabase } from '@/integrations/supabase/client';

/**
 * Get the public URL for a file in Supabase storage
 */
export const getPublicUrl = (bucket: string, path: string): string => {
  if (!path) return '';
  
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl || '';
};

/**
 * Get a signed URL for a file in Supabase storage (useful for private buckets)
 */
export const getSignedUrl = async (bucket: string, path: string, expiresIn: number = 3600): Promise<string> => {
  if (!path) return '';
  
  try {
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
    
    if (error) {
      console.error('Error getting signed URL:', error);
      return '';
    }
    
    return data?.signedUrl || '';
  } catch (error) {
    console.error('Error getting signed URL:', error);
    return '';
  }
};

/**
 * Get the download URL for a file in Supabase storage
 */
export const getDownloadUrl = (bucket: string, path: string): string => {
  if (!path) return '';
  
  return supabase.storage.from(bucket).getPublicUrl(path, {
    download: true,
  }).data.publicUrl;
};

/**
 * Get transformed image URL (for resizing, format conversion, etc.)
 */
export const getTransformedUrl = (bucket: string, path: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'origin';
} = {}): string => {
  if (!path) return '';
  
  return supabase.storage.from(bucket).getPublicUrl(path, {
    transform: options
  }).data.publicUrl;
};

/**
 * Check if a file exists in Supabase storage
 */
export const checkFileExists = async (bucket: string, path: string): Promise<boolean> => {
  if (!path) return false;
  
  try {
    // List files with exact path as prefix to check if file exists
    const { data, error } = await supabase.storage.from(bucket).list(path.split('/').slice(0, -1).join('/'), {
      limit: 1,
      offset: 0,
      search: path.split('/').pop(),
    });
    
    if (error) {
      console.error('Error checking if file exists:', error);
      return false;
    }
    
    return (data?.length || 0) > 0;
  } catch (error) {
    console.error('Error checking if file exists:', error);
    return false;
  }
};

/**
 * Delete a file from Supabase storage
 */
export const deleteFile = async (bucket: string, path: string): Promise<boolean> => {
  if (!path) return false;
  
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    
    if (error) {
      console.error('Error deleting file:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

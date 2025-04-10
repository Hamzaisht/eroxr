
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a unique file path for uploading to storage
 */
export const createUniqueFilePath = (userId: string, fileName: string): string => {
  const fileExt = fileName.split('.').pop();
  const uniqueId = uuidv4().substring(0, 8);
  return `${userId}/${Date.now()}_${uniqueId}.${fileExt}`;
};

/**
 * Adds a cache buster to a URL to prevent caching issues
 */
export const getUrlWithCacheBuster = (baseUrl: string): string => {
  const timestamp = Date.now();
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}t=${timestamp}&r=${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Gets a public URL for a file in Supabase storage
 */
export const getStorageUrl = (bucket: string, path: string): string => {
  if (!path) return '';
  
  // If already a full URL, return as is
  if (path.startsWith('http')) {
    return path;
  }
  
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return data.publicUrl;
};

/**
 * Uploads a file to Supabase storage
 */
export const uploadFileToStorage = async (
  file: File, 
  bucket: string = 'media',
  userId: string
): Promise<{ success: boolean; path?: string; url?: string; error?: string }> => {
  try {
    const filePath = createUniqueFilePath(userId, file.name);
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type // Explicitly set content type
      });

    if (error) throw error;

    // Get the public URL
    const publicUrl = getStorageUrl(bucket, data.path);
    
    return { 
      success: true, 
      path: data.path,
      url: getUrlWithCacheBuster(publicUrl)
    };
  } catch (error: any) {
    console.error('Storage upload error:', error);
    return { 
      success: false, 
      error: error.message || "Failed to upload file" 
    };
  }
};

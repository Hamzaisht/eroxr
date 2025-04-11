
import { supabase } from "@/integrations/supabase/client";

/**
 * Adds a timestamp to a URL to prevent caching
 */
export const getUrlWithCacheBuster = (url: string | null): string | null => {
  if (!url) return null;
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
};

/**
 * Tries to regenerate a fresh URL for media content
 */
export const refreshUrl = (url: string): string => {
  // Remove any existing cache busters
  let freshUrl = url.split('?')[0];
  
  // Generate a new timestamp
  return `${freshUrl}?refresh=${Date.now()}`;
};

/**
 * Determines the media type based on URL or file extension
 */
export const getMediaType = (url: string): 'video' | 'gif' | 'image' => {
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.endsWith('.mp4') || 
      lowerUrl.endsWith('.webm') || 
      lowerUrl.endsWith('.mov') ||
      lowerUrl.includes('video')) {
    return 'video';
  }
  
  if (lowerUrl.endsWith('.gif')) {
    return 'gif';
  }
  
  return 'image';
};

/**
 * Upload file to a specified bucket and return the full public URL
 */
export const uploadFileToStorage = async (
  file: File, 
  bucket: string, 
  userId: string
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;
    
    console.log(`Uploading file to ${bucket}/${filePath}`);
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type // Explicit content type
      });
    
    if (error) {
      console.error("Storage upload error:", error);
      return { success: false, error: error.message };
    }
    
    if (!data || !data.path) {
      return { 
        success: false, 
        error: 'Upload completed but no file path returned' 
      };
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
      
    const urlWithCacheBuster = getUrlWithCacheBuster(publicUrl);
    
    return { 
      success: true, 
      url: urlWithCacheBuster || publicUrl 
    };
  } catch (error: any) {
    console.error("File upload error:", error);
    return { 
      success: false, 
      error: error.message || "An unknown error occurred during upload" 
    };
  }
};

/**
 * Creates a unique file path for storage
 */
export const createUniqueFilePath = (userId: string, fileName: string): string => {
  const fileExt = fileName.split('.').pop();
  const randomId = Math.random().toString(36).substring(2, 9);
  return `${userId}/${Date.now()}_${randomId}.${fileExt}`;
};

/**
 * Determines the content type of a file from its name or data
 */
export const getContentType = (item: any): 'video' | 'image' => {
  // First check if we have explicit media_type or content_type
  if (item?.media_type === 'video' || item?.content_type === 'video') {
    return 'video';
  }
  
  // Then check URLs for file extensions
  if (item?.video_url) {
    return 'video';
  }
  
  if (typeof item === 'string') {
    // If the item is just a string (filename or URL)
    return getMediaType(item) === 'video' ? 'video' : 'image';
  }
  
  // Check file extensions in media_url
  if (item?.media_url) {
    const url = item.media_url.toLowerCase();
    if (url.endsWith('.mp4') || 
        url.endsWith('.webm') || 
        url.endsWith('.mov') ||
        url.includes('video')) {
      return 'video';
    }
  }
  
  // Default to image
  return 'image';
};

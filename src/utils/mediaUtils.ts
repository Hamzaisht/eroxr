
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
 * Refreshes a URL by adding a new cache buster
 */
export const refreshUrl = (url: string): string => {
  return getUrlWithCacheBuster(url);
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
 * Determines the content type (image/video) from file extension or metadata
 */
export const getContentType = (item: any): string => {
  // Use explicit media_type or content_type if available
  if (item.media_type) return item.media_type;
  if (item.content_type) return item.content_type;
  
  // Infer from URLs
  if (item.video_url) return 'video';
  if (item.media_url) {
    if (typeof item.media_url === 'string') {
      return inferMediaTypeFromUrl(item.media_url);
    } 
    if (Array.isArray(item.media_url) && item.media_url.length > 0) {
      return inferMediaTypeFromUrl(item.media_url[0]);
    }
  }
  
  // Default to image if we can't determine
  return 'image';
};

/**
 * Attempts to get a valid media URL from various item properties
 */
export const getMediaUrl = (item: any): string | null => {
  // Check for direct full URLs
  if (item?.video_url && item.video_url.startsWith("http")) {
    return item.video_url;
  }
  
  if (item?.media_url) {
    if (typeof item.media_url === 'string' && item.media_url.startsWith("http")) {
      return item.media_url;
    } else if (Array.isArray(item.media_url) && item.media_url.length > 0) {
      return item.media_url[0];
    }
  }
  
  // Handle storage paths
  if (item?.video_url) {
    return getStorageUrl("media", item.video_url);
  }
  
  if (item?.media_url) {
    if (typeof item.media_url === 'string') {
      return getStorageUrl("media", item.media_url);
    } else if (Array.isArray(item.media_url) && item.media_url.length > 0) {
      return getStorageUrl("media", item.media_url[0]);
    }
  }
  
  return null;
};

/**
 * Attempts to fix potential broken storage URLs
 */
export const fixBrokenStorageUrl = (url: string): string => {
  // Return as is if it's already a valid URL or is missing
  if (!url || url.startsWith('http')) {
    return url;
  }
  
  // Try to build a proper Supabase URL
  try {
    // Remove leading slashes if present
    const cleanPath = url.startsWith("/") ? url.substring(1) : url;
    // Determine bucket based on path segments
    const pathSegments = cleanPath.split('/');
    let bucket = 'media'; // Default bucket
    
    // Try to infer bucket from path
    if (pathSegments[0] === 'stories') bucket = 'stories';
    else if (pathSegments[0] === 'posts') bucket = 'posts';
    else if (pathSegments[0] === 'avatars') bucket = 'avatars';
    else if (pathSegments[0] === 'shorts') bucket = 'shorts';
    
    // Get the public URL from supabase client
    const { data } = supabase.storage.from(bucket).getPublicUrl(cleanPath);
    return data.publicUrl;
  } catch (error) {
    console.error("Error fixing broken URL:", error);
    return url; // Return original if fix fails
  }
};

/**
 * Infer media type from URL or file extension
 */
const inferMediaTypeFromUrl = (url: string): string => {
  if (!url) return 'image'; // Default to image
  
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv', '.wmv', '.m4v'];
  const lowercaseUrl = url.toLowerCase();
  
  // Check for video extensions
  if (videoExtensions.some(ext => lowercaseUrl.includes(ext))) {
    return 'video';
  }
  
  return 'image'; // Default to image for everything else
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

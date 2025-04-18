
import { MediaType } from './types';
import { getFileExtension } from './urlUtils';

/**
 * Create a unique file path for storage
 */
export const createUniqueFilePath = (userId: string, file: File): string => {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 10);
  const extension = file.name.split('.').pop();
  
  return `${userId}/${timestamp}-${randomString}.${extension}`;
};

/**
 * Upload file to Supabase storage
 */
export const uploadFileToStorage = async (
  bucket: string, 
  path: string, 
  file: File
): Promise<{success: boolean, url?: string, error?: string}> => {
  try {
    // Import supabase here to avoid circular dependencies
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      throw error;
    }
    
    // Get public URL
    const { data: publicUrlData } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return {
      success: true,
      url: publicUrlData.publicUrl
    };
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload file'
    };
  }
};

/**
 * Determine media type from file extension, URL or content
 */
export const determineMediaType = (media: any): MediaType => {
  // If MediaType is already determined
  if (media?.media_type) {
    return media.media_type;
  }
  
  // Check for video URL first
  if (media?.video_url) {
    return MediaType.VIDEO;
  }
  
  // Check media_url (can be string or array)
  let url = '';
  
  if (media?.media_url) {
    if (Array.isArray(media.media_url) && media.media_url.length > 0) {
      url = media.media_url[0];
    } else if (typeof media.media_url === 'string') {
      url = media.media_url;
    }
  } else if (typeof media === 'string') {
    url = media;
  }
  
  if (!url) {
    return MediaType.UNKNOWN;
  }
  
  // Check file extension
  const extension = getFileExtension(url);
  
  if (!extension) {
    return MediaType.UNKNOWN;
  }
  
  // Determine type based on extension
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension)) {
    return MediaType.IMAGE;
  } else if (['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'm4v'].includes(extension)) {
    return MediaType.VIDEO;
  } else if (['mp3', 'wav', 'ogg', 'aac', 'm4a'].includes(extension)) {
    return MediaType.AUDIO;
  } else if (['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension)) {
    return MediaType.DOCUMENT;
  }
  
  return MediaType.UNKNOWN;
};

/**
 * Extract media URL from various object types
 */
export const extractMediaUrl = (item: any): string | null => {
  if (!item) return null;
  
  // Handle string directly
  if (typeof item === 'string') {
    return item;
  }
  
  // Check for video_url first
  if (item.video_url) {
    return item.video_url;
  }
  
  // Then check media_url
  if (item.media_url) {
    // Handle array of URLs
    if (Array.isArray(item.media_url) && item.media_url.length > 0) {
      return item.media_url[0];
    }
    // Handle string URL
    if (typeof item.media_url === 'string') {
      return item.media_url;
    }
  }
  
  // Check for other common URL field names
  if (item.url) return item.url;
  if (item.src) return item.src;
  if (item.image) return item.image;
  if (item.thumbnail_url) return item.thumbnail_url;
  
  return null;
};

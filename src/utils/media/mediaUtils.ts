
import { supabase } from '@/integrations/supabase/client';
import { MediaSource, MediaType } from '@/types/media';

/**
 * Creates a unique file path for storage based on user ID and file
 */
export const createUniqueFilePath = (userId: string, file: File | string): string => {
  const timestamp = Date.now();
  let fileExt = 'jpg'; // Default extension
  
  if (typeof file === 'object' && file instanceof File) {
    fileExt = file.name.split('.').pop() || 'jpg';
  } else if (typeof file === 'string') {
    // Try to extract extension from string (URL or base64)
    const matches = file.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
    if (matches && matches[1]) {
      fileExt = matches[1];
    }
  }
  
  return `${userId}/${timestamp}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
};

/**
 * Uploads a file to Supabase storage
 */
export const uploadFileToStorage = async (
  bucket: string, 
  filePath: string, 
  file: File | string
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // Handle string file input (data URL)
    let fileToUpload: File | Blob = file as File;
    
    // Convert data URL to blob if needed
    if (typeof file === 'string' && file.startsWith('data:')) {
      const res = await fetch(file);
      fileToUpload = await res.blob();
    } else if (typeof file !== 'object') {
      return { success: false, error: 'Invalid file format' };
    }
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileToUpload, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      return { success: false, error: error.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { success: true, url: publicUrlData.publicUrl };
  } catch (error: any) {
    console.error('Unexpected upload error:', error);
    return { success: false, error: error.message || 'Unknown upload error' };
  }
};

/**
 * Extract media URL from various formats
 */
export const extractMediaUrl = (src: string | MediaSource | any): string => {
  if (typeof src === 'string') {
    return src;
  }
  
  if (src && typeof src === 'object') {
    // Check all the possible URL properties
    if ('url' in src) return src.url;
    if ('media_url' in src) {
      const mediaUrl = src.media_url;
      if (Array.isArray(mediaUrl) && mediaUrl.length > 0) {
        return mediaUrl[0];
      }
      return mediaUrl as string;
    }
    if ('video_url' in src) return src.video_url as string;
  }
  
  return '';
};

/**
 * Normalize media source to ensure consistent format
 */
export const normalizeMediaSource = (source: string | MediaSource | any): MediaSource => {
  if (typeof source === 'string') {
    // Determine media type from URL
    const url = source;
    const type = detectMediaType(url);
    
    return { url, type };
  }
  
  if (source && typeof source === 'object') {
    if (!('url' in source) && ('media_url' in source || 'video_url' in source)) {
      // Convert alternative URL formats to standard format
      const url = extractMediaUrl(source);
      const type = source.type || detectMediaType(url);
      
      return {
        ...source,
        url,
        type
      };
    }
    
    // Ensure type is correct MediaType enum
    if (typeof source.type === 'string') {
      let mediaType: MediaType;
      
      switch(source.type.toLowerCase()) {
        case 'image': 
          mediaType = MediaType.IMAGE;
          break;
        case 'video':
          mediaType = MediaType.VIDEO;
          break;
        case 'audio':
          mediaType = MediaType.AUDIO;
          break;
        case 'document':
          mediaType = MediaType.DOCUMENT;
          break;
        case 'gif':
          mediaType = MediaType.GIF;
          break;
        default:
          mediaType = MediaType.UNKNOWN;
      }
      
      return {
        ...source,
        type: mediaType
      };
    }
    
    return source as MediaSource;
  }
  
  // Fallback
  return { url: '', type: MediaType.UNKNOWN };
};

/**
 * Detect media type from URL or content type
 */
export const detectMediaType = (url: string): MediaType => {
  const extension = url.split('.').pop()?.toLowerCase() || '';
  
  if (['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(extension)) {
    return MediaType.IMAGE;
  }
  
  if (['gif'].includes(extension)) {
    return MediaType.GIF;
  }
  
  if (['mp4', 'webm', 'ogg', 'mov'].includes(extension)) {
    return MediaType.VIDEO;
  }
  
  if (['mp3', 'wav', 'ogg', 'aac'].includes(extension)) {
    return MediaType.AUDIO;
  }
  
  if (['pdf', 'doc', 'docx', 'txt'].includes(extension)) {
    return MediaType.DOCUMENT;
  }
  
  return MediaType.UNKNOWN;
};

// Alias for backward compatibility
export const determineMediaType = detectMediaType;

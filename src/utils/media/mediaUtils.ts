
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { MediaSource, MediaType } from './types';
import { inferContentTypeFromExtension } from './formatUtils';

/**
 * Creates a unique file path for uploads
 */
export function createUniqueFilePath(userId: string, file: File): string {
  const fileExtension = file.name.split('.').pop() || '';
  const uniqueId = uuidv4();
  const timestamp = Date.now();
  return `${userId}/${uniqueId}_${timestamp}.${fileExtension}`;
}

/**
 * Uploads a file to Supabase storage
 */
export async function uploadFileToStorage(
  bucket: string,
  path: string,
  file: File
): Promise<{success: boolean; url?: string; path?: string; error?: string}> {
  try {
    // Determine content type based on file extension if not provided
    const contentType = file.type || inferContentTypeFromExtension(file.name);
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType,
        upsert: true
      });

    if (error) {
      console.error('Storage upload error:', error);
      return { success: false, error: error.message };
    }

    // Get the public URL of the file
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data?.path || path);

    return { success: true, url: publicUrl, path: data?.path || path };
  } catch (error: any) {
    console.error('File upload error:', error);
    return { 
      success: false, 
      error: error.message || 'An unknown error occurred during upload'
    };
  }
}

/**
 * Determines the media type from various source formats
 */
export function determineMediaType(item: MediaSource | string): MediaType {
  // If it's a string, determine based on extension
  if (typeof item === 'string') {
    const url = item.toLowerCase();
    if (url.match(/\.(jpg|jpeg|png|gif|webp|avif|bmp)(\?.*)?$/i)) return MediaType.IMAGE;
    if (url.match(/\.(mp4|webm|mov|avi|wmv|flv|mkv)(\?.*)?$/i)) return MediaType.VIDEO;
    if (url.match(/\.(mp3|wav|ogg|aac|flac)(\?.*)?$/i)) return MediaType.AUDIO;
    if (url.match(/\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)(\?.*)?$/i)) return MediaType.DOCUMENT;
    return MediaType.UNKNOWN;
  }

  // If it's an object with a media_type property, use that
  if (item.media_type) {
    if (typeof item.media_type === 'string') {
      return MediaType[item.media_type.toUpperCase() as keyof typeof MediaType] || MediaType.UNKNOWN;
    }
    return item.media_type;
  }

  // Otherwise try to determine by checking various properties
  if (item.video_url || (item.video_urls && item.video_urls.length > 0)) return MediaType.VIDEO;
  if (item.media_url || (item.media_urls && item.media_urls.length > 0)) {
    // If media_url is a string, check its extension
    if (typeof item.media_url === 'string') {
      return determineMediaType(item.media_url);
    }
    // If media_url is an array, check the first item
    if (Array.isArray(item.media_url) && item.media_url.length > 0) {
      return determineMediaType(item.media_url[0]);
    }
    // Check media_urls array
    if (Array.isArray(item.media_urls) && item.media_urls.length > 0) {
      return determineMediaType(item.media_urls[0]);
    }
    return MediaType.IMAGE; // Default to image if we can't determine
  }
  
  return MediaType.UNKNOWN;
}

/**
 * Extracts the media URL from various source formats
 */
export function extractMediaUrl(item: MediaSource | string): string | null {
  if (typeof item === 'string') return item;
  
  // Check various properties in order of preference
  if (item.video_url) {
    if (typeof item.video_url === 'string') return item.video_url;
    if (Array.isArray(item.video_url) && item.video_url.length > 0) return item.video_url[0];
  }
  
  if (item.media_url) {
    if (typeof item.media_url === 'string') return item.media_url;
    if (Array.isArray(item.media_url) && item.media_url.length > 0) return item.media_url[0];
  }
  
  if (item.url) return item.url;
  if (item.src) return item.src;
  
  // If video_urls array exists and has items
  if (item.video_urls && item.video_urls.length > 0) return item.video_urls[0];
  
  // If media_urls array exists and has items
  if (item.media_urls && item.media_urls.length > 0) return item.media_urls[0];
  
  return null;
}

/**
 * Gets a playable media URL (handles caching, CDN issues, etc)
 */
export function getPlayableMediaUrl(url: string): string {
  // Add any special handling for media URLs here
  // For example, adding cache busting parameters, CDN tokens, etc.
  if (!url) return '';
  
  // Special handling for blob URLs and data URLs
  if (url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  
  // Add cache busting for regular URLs
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_cb=${Date.now()}`;
}

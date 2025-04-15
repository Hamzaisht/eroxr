
/**
 * Comprehensive media utilities for handling URLs, types, and processing
 */

import { supabase } from "@/integrations/supabase/client";

/**
 * Media type detection
 */
export enum MediaType {
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  UNKNOWN = "unknown"
}

interface MediaItem {
  media_url?: string | null | string[];
  video_url?: string | null;
  content_type?: string;
  media_type?: string;
  [key: string]: any;
}

/**
 * Determine media type from an item or URL
 */
export function determineMediaType(item: MediaItem | string): MediaType {
  // Handle direct URL string
  if (typeof item === 'string') {
    const url = item.toLowerCase();
    if (url.match(/\.(mp4|webm|mov|avi)($|\?)/)) return MediaType.VIDEO;
    if (url.match(/\.(jpe?g|png|gif|webp|avif|svg)($|\?)/)) return MediaType.IMAGE;
    if (url.match(/\.(mp3|wav|ogg|aac)($|\?)/)) return MediaType.AUDIO;
    if (url.includes('/videos/') || url.includes('/shorts/')) return MediaType.VIDEO;
    return MediaType.UNKNOWN;
  }

  // Handle object
  if (!item) return MediaType.UNKNOWN;

  // Check explicit media type if available
  if (item.media_type === 'video' || item.content_type === 'video') {
    return MediaType.VIDEO;
  }
  
  if (item.media_type === 'image' || item.content_type === 'image') {
    return MediaType.IMAGE;
  }
  
  if (item.media_type === 'audio' || item.content_type === 'audio') {
    return MediaType.AUDIO;
  }

  // Check URL presence
  if (item.video_url) return MediaType.VIDEO;
  
  // Check media_url format if it exists
  if (item.media_url) {
    if (typeof item.media_url === 'string') {
      return determineMediaType(item.media_url);
    } else if (Array.isArray(item.media_url) && item.media_url.length > 0) {
      return determineMediaType(item.media_url[0]);
    }
  }

  return MediaType.UNKNOWN;
}

/**
 * Extract the appropriate media URL from an item
 */
export function extractMediaUrl(item: MediaItem | string): string | null {
  // Handle direct string
  if (typeof item === 'string') return item;
  
  if (!item) return null;
  
  // Get the appropriate URL based on media type
  const mediaType = determineMediaType(item);
  
  if (mediaType === MediaType.VIDEO && item.video_url) {
    return item.video_url;
  }
  
  if (item.media_url) {
    if (typeof item.media_url === 'string') {
      return item.media_url;
    } else if (Array.isArray(item.media_url) && item.media_url.length > 0) {
      return item.media_url[0];
    }
  }
  
  return null;
}

/**
 * Add cache busting parameter to a URL
 */
export function addCacheBuster(url: string): string {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  
  // If URL already has a cache buster, don't add another one
  if (url.includes('?') && (url.includes('t=') || url.includes('v='))) {
    return url;
  }
  
  const timestamp = Date.now();
  const separator = url.includes('?') ? '&' : '?';
  
  return `${url}${separator}t=${timestamp}`;
}

/**
 * Clean a URL by removing query parameters
 */
export function getCleanUrl(url: string): string {
  if (!url) return '';
  return url.split('?')[0];
}

/**
 * Get a playable media URL for videos and images
 * This is the main entry point for getting media URLs
 */
export function getPlayableMediaUrl(item: MediaItem | string): string | null {
  try {
    const url = extractMediaUrl(item);
    
    if (!url) return null;
    
    // Clean the URL and add cache buster
    const cleanUrl = getCleanUrl(url);
    return addCacheBuster(cleanUrl);
  } catch (error) {
    console.error("Error in getPlayableMediaUrl:", error);
    return null;
  }
}

/**
 * Check if a URL is accessible
 */
export async function checkUrlAccessibility(url: string): Promise<{ 
  accessible: boolean; 
  contentType?: string;
  error?: string;
}> {
  try {
    // For blob: and data: URLs, assume they're valid
    if (url.startsWith('blob:') || url.startsWith('data:')) {
      return { accessible: true };
    }
    
    // Perform a HEAD request to check validity
    const response = await fetch(url, { 
      method: 'HEAD',
      cache: 'no-store'
    });
    
    return {
      accessible: response.ok,
      contentType: response.headers.get('content-type') || undefined
    };
  } catch (error) {
    console.warn('URL check failed, but will continue anyway:', url);
    // Return valid=true even if the check failed due to CORS issues
    return {
      accessible: true, 
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Get media URL from Supabase storage
 */
export async function getStorageUrl(path: string, bucket = 'media'): Promise<string | null> {
  if (!path) return null;
  
  try {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
      
    return data?.publicUrl || null;
  } catch (error) {
    console.error('Failed to get storage URL:', error);
    return null;
  }
}

/**
 * Create a unique file path for storage
 * @param userId - The user ID who is uploading the file
 * @param file - The file to create a path for
 * @returns A unique file path
 */
export function createUniqueFilePath(userId: string, file: File): string {
  return `${userId}/${Date.now()}_${file.name}`;
}

/**
 * Upload a file to Supabase storage
 */
export async function uploadFileToStorage(bucket: string, path: string, file: File): Promise<string | null> {
  try {
    // Determine content type based on file extension
    const contentType = file.type || inferContentTypeFromExtension(file.name);
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType,
        upsert: true,
        cacheControl: '3600'
      });

    if (error) {
      console.error('Storage upload error:', error);
      return null;
    }

    // Get the public URL of the file
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data?.path || path);

    return publicUrl;
  } catch (error: any) {
    console.error('File upload error:', error);
    return null;
  }
}

/**
 * Infer content type from file extension
 */
export function inferContentTypeFromExtension(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'mp4':
      return 'video/mp4';
    case 'webm':
      return 'video/webm';
    case 'mov':
      return 'video/quicktime';
    case 'avi':
      return 'video/x-msvideo';
    default:
      return 'application/octet-stream';
  }
}

/**
 * Get content type from a file or URL
 */
export function getContentType(fileOrUrl: File | string): string {
  if (typeof fileOrUrl !== 'string') {
    return fileOrUrl.type.startsWith('video/') ? 'video' : 'image';
  }
  
  const url = fileOrUrl.toLowerCase();
  
  if (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov') || url.endsWith('.avi')) {
    return 'video';
  } else if (url.includes('/video/') || url.includes('videos/')) {
    return 'video';
  }
  
  return 'image';
}

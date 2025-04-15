
/**
 * Comprehensive media utilities for handling URLs, types, and processing
 */

import { supabase } from "@/integrations/supabase/client";
import { MediaType, MediaSource, MediaResult } from "./types";

// Export all from our specialized modules
export * from "./types";
export * from "./urlUtils";
export * from "./formatUtils";

/**
 * Infer content type from file extension
 * @param filename - The filename to check
 * @returns The MIME type for the file
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
 * Create a unique file path for storage
 * @param userId - The user ID who is uploading the file
 * @param file - The file to create a path for
 * @returns A unique file path
 */
export function createUniqueFilePath(userId: string, file: File): string {
  return `${userId}/${Date.now()}_${file.name}`;
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
 * Determine the media type from a source
 */
export function determineMediaType(source: any): MediaType {
  if (!source) return MediaType.UNKNOWN;
  
  // If it's a string, check the extension
  if (typeof source === 'string') {
    const url = source.toLowerCase();
    if (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov')) {
      return MediaType.VIDEO;
    }
    if (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.gif') || url.endsWith('.webp')) {
      return MediaType.IMAGE;
    }
    if (url.endsWith('.mp3') || url.endsWith('.wav') || url.endsWith('.ogg')) {
      return MediaType.AUDIO;
    }
    if (url.endsWith('.pdf') || url.endsWith('.doc') || url.endsWith('.docx')) {
      return MediaType.DOCUMENT;
    }
    return MediaType.UNKNOWN;
  }
  
  // Check object properties
  if (source) {
    // Explicit media_type or content_type property
    if (source.media_type) {
      const type = source.media_type.toLowerCase();
      if (type === 'video') return MediaType.VIDEO;
      if (type === 'image') return MediaType.IMAGE;
      if (type === 'audio') return MediaType.AUDIO;
      if (type === 'document') return MediaType.DOCUMENT;
    }
    
    if (source.content_type) {
      const type = source.content_type.toLowerCase();
      if (type === 'video') return MediaType.VIDEO;
      if (type === 'image') return MediaType.IMAGE;
      if (type === 'audio') return MediaType.AUDIO;
      if (type === 'document') return MediaType.DOCUMENT;
    }
    
    // Check for presence of specific URL properties
    if (source.video_url || source.video_urls) {
      return MediaType.VIDEO;
    }
    if (source.media_url || source.media_urls) {
      // For media_url, we check if it looks like a video URL
      const url = source.media_url || (source.media_urls && source.media_urls[0]);
      if (url && typeof url === 'string') {
        const lowerUrl = url.toLowerCase();
        if (lowerUrl.endsWith('.mp4') || lowerUrl.endsWith('.webm') || lowerUrl.endsWith('.mov')) {
          return MediaType.VIDEO;
        }
      }
      return MediaType.IMAGE;
    }
  }
  
  return MediaType.UNKNOWN;
}

/**
 * Get content type based on URL or extension
 */
export function getContentType(url: string): string {
  if (!url) return 'application/octet-stream';
  
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.endsWith('.jpg') || lowerUrl.endsWith('.jpeg')) {
    return 'image/jpeg';
  }
  if (lowerUrl.endsWith('.png')) {
    return 'image/png';
  }
  if (lowerUrl.endsWith('.gif')) {
    return 'image/gif';
  }
  if (lowerUrl.endsWith('.webp')) {
    return 'image/webp';
  }
  if (lowerUrl.endsWith('.mp4')) {
    return 'video/mp4';
  }
  if (lowerUrl.endsWith('.webm')) {
    return 'video/webm';
  }
  if (lowerUrl.endsWith('.mov')) {
    return 'video/quicktime';
  }
  if (lowerUrl.endsWith('.mp3')) {
    return 'audio/mpeg';
  }
  if (lowerUrl.endsWith('.wav')) {
    return 'audio/wav';
  }
  if (lowerUrl.endsWith('.pdf')) {
    return 'application/pdf';
  }
  
  return 'application/octet-stream';
}

/**
 * Extract media URL from an object or string
 */
export function extractMediaUrl(item: any): string | null {
  if (!item) return null;
  
  // If it's already a string, return it
  if (typeof item === 'string') {
    return item;
  }
  
  // Try to find a URL in the object
  return item.video_url || 
    (Array.isArray(item.video_urls) && item.video_urls.length > 0 ? item.video_urls[0] : null) ||
    item.media_url ||
    (Array.isArray(item.media_urls) && item.media_urls.length > 0 ? item.media_urls[0] : null) ||
    item.url ||
    item.src ||
    null;
}

/**
 * Utility functions for processing media files and URLs
 */

import { MediaSource, MediaType } from './types';
import { supabase } from "@/integrations/supabase/client";

/**
 * Extract the main URL from a media source object or string
 */
export function extractMediaUrl(source: MediaSource | string | null | undefined): string | null {
  if (!source) return null;
  
  // If source is already a string, return it directly
  if (typeof source === 'string') return source;
  
  // Check for various URL properties in order of preference
  const url = source.url || 
              source.src || 
              source.video_url || 
              source.media_url ||
              (source.media_urls && source.media_urls.length > 0 ? source.media_urls[0] : null) ||
              (source.video_urls && source.video_urls.length > 0 ? source.video_urls[0] : null);
              
  return url || null;
}

/**
 * Determine the media type from a URL or media source object
 */
export function determineMediaType(source: MediaSource | string | null | undefined): MediaType {
  if (!source) return MediaType.UNKNOWN;
  
  // Extract media URL
  const url = extractMediaUrl(source);
  if (!url) return MediaType.UNKNOWN;
  
  // If source is an object with explicit media_type, use that
  if (typeof source !== 'string') {
    if (source.media_type === 'video' || source.content_type === 'video') {
      return MediaType.VIDEO;
    }
    if (source.media_type === 'image' || source.content_type === 'image') {
      return MediaType.IMAGE;
    }
    if (source.media_type === 'audio' || source.content_type === 'audio') {
      return MediaType.AUDIO;
    }
    if (source.media_type === 'document' || source.content_type === 'document') {
      return MediaType.DOCUMENT;
    }
  }
  
  // Check URL patterns and extensions
  const lowercaseUrl = url.toLowerCase();
  
  // Check for video indicators
  if (
    lowercaseUrl.includes('/videos/') || 
    lowercaseUrl.includes('/video/') ||
    lowercaseUrl.includes('/shorts/') ||
    lowercaseUrl.endsWith('.mp4') || 
    lowercaseUrl.endsWith('.webm') || 
    lowercaseUrl.endsWith('.mov') || 
    lowercaseUrl.endsWith('.avi')
  ) {
    return MediaType.VIDEO;
  }
  
  // Check for image indicators
  if (
    lowercaseUrl.includes('/images/') ||
    lowercaseUrl.includes('/image/') ||
    lowercaseUrl.endsWith('.jpg') || 
    lowercaseUrl.endsWith('.jpeg') || 
    lowercaseUrl.endsWith('.png') || 
    lowercaseUrl.endsWith('.gif') || 
    lowercaseUrl.endsWith('.webp')
  ) {
    return MediaType.IMAGE;
  }
  
  // Check for audio indicators
  if (
    lowercaseUrl.includes('/audio/') ||
    lowercaseUrl.endsWith('.mp3') || 
    lowercaseUrl.endsWith('.wav') || 
    lowercaseUrl.endsWith('.ogg')
  ) {
    return MediaType.AUDIO;
  }
  
  // Check for document indicators
  if (
    lowercaseUrl.includes('/documents/') ||
    lowercaseUrl.endsWith('.pdf') || 
    lowercaseUrl.endsWith('.doc') || 
    lowercaseUrl.endsWith('.docx')
  ) {
    return MediaType.DOCUMENT;
  }
  
  // Default to image if nothing matches
  return MediaType.IMAGE;
}

/**
 * Generate a URL with cache busting to prevent caching issues
 */
export function addCacheBuster(url: string): string {
  if (!url) return url;
  
  const separator = url.includes('?') ? '&' : '?';
  const cacheBuster = `cache=${Date.now()}`;
  return `${url}${separator}${cacheBuster}`;
}

/**
 * Create a unique file path for storage
 */
export function createUniqueFilePath(userId: string, file: File): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  const extension = file.name.split('.').pop() || '';
  const safeName = file.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
  
  return `${userId}/${timestamp}-${randomString}-${safeName}.${extension}`;
}

/**
 * Get content type from a URL
 */
export function getContentType(url: string): string {
  if (!url) return 'unknown';
  
  const lowercaseUrl = url.toLowerCase();
  
  if (lowercaseUrl.endsWith('.mp4')) return 'video/mp4';
  if (lowercaseUrl.endsWith('.webm')) return 'video/webm';
  if (lowercaseUrl.endsWith('.mov')) return 'video/quicktime';
  
  if (lowercaseUrl.endsWith('.jpg') || lowercaseUrl.endsWith('.jpeg')) return 'image/jpeg';
  if (lowercaseUrl.endsWith('.png')) return 'image/png';
  if (lowercaseUrl.endsWith('.gif')) return 'image/gif';
  if (lowercaseUrl.endsWith('.webp')) return 'image/webp';
  
  if (lowercaseUrl.endsWith('.mp3')) return 'audio/mpeg';
  if (lowercaseUrl.endsWith('.wav')) return 'audio/wav';
  
  if (lowercaseUrl.endsWith('.pdf')) return 'application/pdf';
  
  // Default
  return 'application/octet-stream';
}

/**
 * Infer content type from file extension
 */
export function inferContentTypeFromExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  
  const contentTypeMap: Record<string, string> = {
    // Images
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    
    // Videos
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'mov': 'video/quicktime',
    'avi': 'video/x-msvideo',
    
    // Audio
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'ogg': 'audio/ogg',
    
    // Documents
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    
    // Other
    'zip': 'application/zip',
    'json': 'application/json',
    'txt': 'text/plain'
  };
  
  return contentTypeMap[ext] || 'application/octet-stream';
}

/**
 * Upload file to Supabase storage
 */
export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadFileToStorage(
  bucket: string, 
  path: string, 
  file: File
): Promise<UploadResult> {
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

    // Get the public URL
    const url = getStorageUrl(bucket, data?.path || path);
    
    return { success: true, url };
  } catch (error: any) {
    console.error('File upload error:', error);
    return { 
      success: false, 
      error: error.message || 'An unknown error occurred during upload'
    };
  }
}

/**
 * Get storage URL for a file
 */
export function getStorageUrl(bucket: string, path: string): string {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
}

import { MediaType, MediaSource, MediaAccessLevel, UploadOptions } from './types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Extract a URL from a MediaSource object or return the string if it's already a string
 */
export function extractMediaUrl(source: MediaSource | string): string {
  if (!source) return '';
  if (typeof source === 'string') return source;
  return source.url || '';
}

/**
 * Normalize a variety of inputs into a MediaSource object
 */
export function normalizeMediaSource(input: any): MediaSource {
  // If it's already in the right format
  if (input && typeof input === 'object' && 'url' in input && 'type' in input) {
    return input as MediaSource;
  }

  // If it's a string URL
  if (typeof input === 'string') {
    // Try to determine type from URL
    const url = input;
    const isImage = /\.(jpg|jpeg|png|gif|webp|svg|avif)($|\?)/i.test(url);
    const isVideo = /\.(mp4|webm|mov|avi)($|\?)/i.test(url);
    const isAudio = /\.(mp3|wav|ogg|aac)($|\?)/i.test(url);
    
    let type = MediaType.UNKNOWN;
    if (isImage) type = MediaType.IMAGE;
    else if (isVideo) type = MediaType.VIDEO;
    else if (isAudio) type = MediaType.AUDIO;
    
    return { url, type };
  }

  // If it has media_url, video_url, or thumbnail_url (compatibility with old format)
  if (input && typeof input === 'object') {
    if (input.media_url) {
      return {
        url: Array.isArray(input.media_url) ? input.media_url[0] : input.media_url,
        type: MediaType.IMAGE,
        thumbnail: input.thumbnail_url,
      };
    }
    
    if (input.video_url) {
      return {
        url: input.video_url,
        type: MediaType.VIDEO,
        thumbnail: input.thumbnail_url,
        poster: input.thumbnail_url,
      };
    }
    
    if (input.thumbnail_url) {
      return {
        url: input.thumbnail_url,
        type: MediaType.IMAGE,
      };
    }
  }

  // Default fallback
  return { url: '', type: MediaType.UNKNOWN };
}

/**
 * Calculate aspect ratio dimensions
 */
export function calculateAspectRatioDimensions(
  originalWidth: number, 
  originalHeight: number,
  targetWidth?: number,
  targetHeight?: number
): { width: number; height: number } {
  // If no target dimensions provided, return original dimensions
  if (!targetWidth && !targetHeight) {
    return { width: originalWidth, height: originalHeight };
  }
  
  // Calculate aspect ratio
  const aspectRatio = originalWidth / originalHeight;
  
  // If targetWidth is provided but not targetHeight
  if (targetWidth && !targetHeight) {
    return {
      width: targetWidth,
      height: Math.round(targetWidth / aspectRatio)
    };
  }
  
  // If targetHeight is provided but not targetWidth
  if (targetHeight && !targetWidth) {
    return {
      width: Math.round(targetHeight * aspectRatio),
      height: targetHeight
    };
  }
  
  // If both are provided, maintain aspect ratio within bounds
  if (targetWidth && targetHeight) {
    const targetRatio = targetWidth / targetHeight;
    
    if (aspectRatio > targetRatio) {
      // Width constrains
      return {
        width: targetWidth,
        height: Math.round(targetWidth / aspectRatio)
      };
    } else {
      // Height constrains
      return {
        width: Math.round(targetHeight * aspectRatio),
        height: targetHeight
      };
    }
  }
  
  // Fallback
  return { width: originalWidth, height: originalHeight };
}

/**
 * Determine the media type from a URL or other source
 */
export function determineMediaType(source: string | MediaSource): MediaType {
  // If it's already a MediaSource object, return its type
  if (typeof source !== 'string' && source?.type) {
    return source.type;
  }
  
  // Get the URL string
  const url = typeof source === 'string' ? source : (source?.url || '');
  
  // Check extensions
  if (/\.(jpg|jpeg|png|gif|webp|svg|avif)($|\?)/i.test(url)) {
    return MediaType.IMAGE;
  } else if (/\.(mp4|webm|mov|avi|mkv)($|\?)/i.test(url)) {
    return MediaType.VIDEO;
  } else if (/\.(mp3|wav|ogg|aac|flac)($|\?)/i.test(url)) {
    return MediaType.AUDIO;
  } else if (/\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)($|\?)/i.test(url)) {
    return MediaType.DOCUMENT;
  }
  
  // If we can't determine based on extension, try to make an educated guess
  if (url.includes('image')) {
    return MediaType.IMAGE;
  } else if (url.includes('video')) {
    return MediaType.VIDEO;
  } else if (url.includes('audio')) {
    return MediaType.AUDIO;
  }
  
  // Default fallback
  return MediaType.UNKNOWN;
}

/**
 * Create a unique file path for storage
 * @param file The file to create a path for
 * @param options Options for path creation
 * @returns A unique file path
 */
export function createUniqueFilePath(file: File, options: { folder?: string } = {}): string {
  if (!file) return '';
  
  const { folder = '' } = options;
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  const fileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  
  const folderPrefix = folder ? `${folder.replace(/\/*$/, '')}/` : '';
  return `${folderPrefix}${timestamp}_${randomString}_${fileName}`;
}

/**
 * Format a file size in bytes to a human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Add a cache buster to a URL
 */
export function addCacheBuster(url: string): string {
  if (!url) return '';
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
}

/**
 * Upload a file to storage
 */
export async function uploadFileToStorage(
  file: File, 
  options: UploadOptions = {}
): Promise<UploadResult> {
  if (!file) {
    return { success: false, error: 'No file provided' };
  }
  
  const {
    bucket = 'media',  // Default bucket is 'media' if not specified
    path,
    contentType = file.type,
    folder = '',
    accessLevel = MediaAccessLevel.PUBLIC
  } = options;
  
  try {
    // Generate file path if not provided
    const filePath = path || createUniqueFilePath(file, { folder });
    
    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        contentType,
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) {
      console.error('File upload error:', error);
      return { 
        success: false, 
        error: error.message,
      };
    }
    
    // Get the URL
    let url;
    if (accessLevel === MediaAccessLevel.PUBLIC) {
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);
      
      url = publicUrlData.publicUrl;
    } else {
      // For private files, create a signed URL
      const { data: signedUrlData } = await supabase.storage
        .from(bucket)
        .createSignedUrl(data.path, 60 * 60); // 1 hour expiration
        
      url = signedUrlData?.signedUrl;
    }
    
    return {
      success: true,
      url,
      publicUrl: url,
      path: data.path,
      accessLevel
    };
  } catch (err: any) {
    console.error('File upload unexpected error:', err);
    return {
      success: false,
      error: err.message || 'Unknown upload error',
    };
  }
}

/**
 * Get a playable media URL with cache busting
 */
export function getPlayableMediaUrl(url: string): string {
  if (!url) return '';
  
  // Add cache busting for certain storage URLs
  if ((url.includes('storage/v1/object') || url.includes('cloudfront.net')) && !url.includes('?t=')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${Date.now()}`;
  }
  
  return url;
}

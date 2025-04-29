import { MediaType, MediaSource } from './types';
import { isVideoUrl, isImageUrl, getCleanUrl } from './urlUtils';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

/**
 * Extract media URL from various source formats
 */
export const extractMediaUrl = (source: any): string => {
  if (!source) return '';
  
  // Direct string URL
  if (typeof source === 'string') {
    return source;
  }
  
  // Extract from media object with priority order
  if (typeof source === 'object') {
    const extractedUrl = source.video_url || 
      (Array.isArray(source.video_urls) && source.video_urls.length > 0 ? source.video_urls[0] : '') ||
      source.media_url || 
      (Array.isArray(source.media_urls) && source.media_urls.length > 0 ? source.media_urls[0] : '') ||
      source.url || 
      source.src || 
      '';
    
    return extractedUrl;
  }
  
  return '';
};

/**
 * Extract thumbnail URL from a media source
 */
export const extractThumbnailUrl = (source: any): string => {
  if (!source) return '';
  
  if (typeof source === 'object') {
    return source.thumbnail_url || 
           source.poster || 
           source.video_thumbnail_url || 
           (Array.isArray(source.media_urls) && source.media_urls.length > 0 ? source.media_urls[0] : '') ||
           '';
  }
  
  return '';
};

/**
 * Determine the media type based on the source
 */
export const determineMediaType = (source: MediaSource | string): MediaType => {
  // Handle string URL directly
  if (typeof source === 'string') {
    const url = source.toLowerCase();
    
    if (isVideoUrl(url)) return MediaType.VIDEO;
    if (isImageUrl(url)) return MediaType.IMAGE;
    if (url.match(/\.(mp3|wav|ogg|m4a)($|\?)/i)) return MediaType.AUDIO;
    if (url.match(/\.(pdf|docx?|xlsx?|pptx?)($|\?)/i)) return MediaType.DOCUMENT;
    
    // Default to image if no match
    return MediaType.UNKNOWN;
  }
  
  // Handle object
  if (typeof source === 'object' && source !== null) {
    // Check for explicit type indicator
    if (source.media_type) return source.media_type;
    if (source.content_type === 'video') return MediaType.VIDEO;
    if (source.content_type === 'image') return MediaType.IMAGE;
    if (source.content_type === 'audio') return MediaType.AUDIO;
    if (source.content_type === 'document') return MediaType.DOCUMENT;
    
    // Check for URL presence
    if (source.video_url || Array.isArray(source.video_urls) && source.video_urls.length > 0) {
      return MediaType.VIDEO;
    }
    
    if (source.media_url || Array.isArray(source.media_urls) && source.media_urls.length > 0) {
      const mediaUrl = source.media_url || source.media_urls[0];
      return determineMediaType(mediaUrl);
    }
    
    // Check for generic url property
    if (source.url) {
      return determineMediaType(source.url);
    }
  }
  
  return MediaType.UNKNOWN;
};

/**
 * Generate placeholder image URL for different media types
 */
export const getPlaceholderForType = (mediaType: MediaType): string => {
  switch (mediaType) {
    case MediaType.VIDEO:
      return '/assets/placeholders/video-placeholder.jpg';
    case MediaType.AUDIO:
      return '/assets/placeholders/audio-placeholder.jpg';
    case MediaType.DOCUMENT:
      return '/assets/placeholders/document-placeholder.jpg';
    case MediaType.IMAGE:
      return '/assets/placeholders/image-placeholder.jpg';
    default:
      return '/assets/placeholders/media-placeholder.jpg';
  }
};

/**
 * Pre-load an image and return a promise that resolves when loaded
 */
export const preloadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = getCleanUrl(src);
  });
};

/**
 * Check if a media URL is accessible
 */
export const checkMediaAccessibility = async (url: string): Promise<boolean> => {
  if (!url) return false;
  
  // For client-side only
  if (typeof window === 'undefined') return true;
  
  // Skip accessibility check for blob URLs and data URLs
  if (url.startsWith('blob:') || url.startsWith('data:')) return true;
  
  try {
    const response = await fetch(getCleanUrl(url), { 
      method: 'HEAD',
      mode: 'no-cors', // Use no-cors to avoid CORS issues
      cache: 'no-cache'
    });
    
    return true; // If no error, assume it's accessible (no-cors doesn't give status)
  } catch (error) {
    console.error('Media accessibility check failed:', url, error);
    return false;
  }
};

/**
 * Creates a unique file path for uploading to storage
 * Format: userId/timestamp-uuid.extension
 */
export const createUniqueFilePath = (userId: string, file: File): string => {
  const timestamp = Date.now();
  const uniqueId = uuidv4().substring(0, 8);
  const extension = file.name.split('.').pop() || 'unknown';
  
  return `${userId}/${timestamp}-${uniqueId}.${extension}`;
};

/**
 * Upload a file to Supabase storage
 */
export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

export const uploadFileToStorage = async (
  bucketName: string,
  filePath: string,
  file: File,
  options?: {
    contentType?: string;
    cacheControl?: string;
    upsert?: boolean;
  }
): Promise<UploadResult> => {
  try {
    console.log(`Uploading file to ${bucketName}/${filePath}`);
    
    // Set default options
    const uploadOptions = {
      cacheControl: options?.cacheControl || '3600',
      upsert: options?.upsert !== undefined ? options.upsert : true,
      contentType: options?.contentType || file.type
    };
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, uploadOptions);
    
    if (error) {
      console.error('Storage upload error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
    
    if (!data) {
      return { 
        success: false, 
        error: 'Upload completed but no data returned' 
      };
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);
    
    return {
      success: true,
      url: publicUrl,
      path: data.path
    };
  } catch (error: any) {
    console.error('Storage upload error:', error);
    return { 
      success: false, 
      error: error.message || 'An unknown error occurred during upload'
    };
  }
};

/**
 * Report media loading errors for monitoring
 */
export const reportMediaError = (
  url: string | null,
  errorType: string,
  retryCount: number,
  mediaType: string,
  componentName: string
): void => {
  // Implement error reporting logic
  console.error(`Media error in ${componentName}:`, {
    url: url?.substring(0, 100),
    errorType,
    retryCount,
    mediaType,
    timestamp: new Date().toISOString()
  });
  
  // In a real application, you might want to send this to a monitoring service
};

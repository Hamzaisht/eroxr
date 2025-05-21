
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { MediaSource, MediaType } from '@/utils/media/types';

/**
 * Creates a unique file path for uploads
 * @param userId The user ID to associate with the file
 * @param file The file being uploaded
 * @returns Unique file path
 */
export const createUniqueFilePath = (userId: string, file: File): string => {
  const timestamp = Date.now();
  const uniqueId = uuidv4().substring(0, 8);
  const fileExt = file.name.split('.').pop() || '';
  const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${userId}/${timestamp}-${uniqueId}-${safeFileName}`;
};

/**
 * Adds cache busting parameters to URLs
 * @param url The URL to add cache busting to
 * @returns URL with cache busting parameters
 */
export const addCacheBuster = (url: string): string => {
  if (!url) return url;
  
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${timestamp}&r=${random}`;
};

/**
 * Extract media URL from different source formats
 * @param source Media source (object or string)
 * @returns URL string
 */
export const extractMediaUrl = (source: MediaSource | string): string => {
  if (!source) return '';
  
  if (typeof source === 'string') {
    return source;
  }
  
  return source.url || '';
};

/**
 * Normalizes media source to a standard format
 * @param source Media source in various formats
 * @returns Standardized MediaSource object
 */
export const normalizeMediaSource = (source: any): MediaSource => {
  // Handle string URLs
  if (typeof source === 'string') {
    const isVideo = source.match(/\.(mp4|webm|mov|avi)($|\?)/i);
    return {
      url: source,
      type: isVideo ? MediaType.VIDEO : MediaType.IMAGE
    };
  }
  
  // Already a MediaSource
  if (source && typeof source === 'object' && 'url' in source) {
    return {
      ...source,
      url: source.url,
      type: source.type || determineMediaType(source.url)
    };
  }
  
  // Handle object with different property names
  if (source && typeof source === 'object') {
    // Look for common URL properties
    const url = source.url || 
                source.src || 
                source.media_url || 
                source.video_url || 
                source.image_url || 
                '';
    
    return {
      url,
      type: determineMediaType(url),
      creator_id: source.creator_id || source.user_id,
      post_id: source.post_id || source.id
    };
  }
  
  // Default empty source
  return { url: '', type: MediaType.UNKNOWN };
};

/**
 * Determines media type from URL or file extension
 * @param url URL or file path
 * @returns Media type
 */
export const determineMediaType = (url: string): MediaType => {
  if (!url) return MediaType.UNKNOWN;
  
  const videoExtensions = /\.(mp4|webm|mov|avi|mkv)($|\?)/i;
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|avif|bmp)($|\?)/i;
  const audioExtensions = /\.(mp3|wav|ogg|aac|flac)($|\?)/i;
  
  if (url.match(videoExtensions)) return MediaType.VIDEO;
  if (url.match(imageExtensions)) return MediaType.IMAGE;
  if (url.match(audioExtensions)) return MediaType.AUDIO;
  
  // Check for service-specific video URLs
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return MediaType.VIDEO;
  }
  
  return MediaType.UNKNOWN;
};

/**
 * Gets public URL for a file in storage
 * @param bucketName Bucket name
 * @param filePath File path within the bucket
 * @returns Public URL with cache busting
 */
export const getPublicUrl = (bucketName: string, filePath: string): string => {
  if (!filePath) return '';
  
  try {
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
      
    if (data?.publicUrl) {
      return addCacheBuster(data.publicUrl);
    }
    
    return '';
  } catch (error) {
    console.error('Error generating public URL:', error);
    return '';
  }
};

/**
 * Checks if media URL is accessible
 * @param url Media URL to check
 * @returns Promise that resolves to boolean
 */
export async function isMediaAccessible(url: string): Promise<boolean> {
  if (!url) return false;
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Media accessibility check failed:', error);
    return false;
  }
}

/**
 * Report a media error
 */
export function reportMediaError(
  url: string,
  errorType: string,
  retryCount: number,
  mediaType: string,
  componentName: string
): void {
  console.error('Media Error Report:', {
    url,
    errorType,
    retryCount,
    mediaType,
    componentName,
    timestamp: new Date().toISOString()
  });
  
  // In a production app, send this to a monitoring service
}


import { MediaSource, MediaType } from './types';

/**
 * Calculate aspect ratio dimensions based on original width and height
 * @param originalWidth Original width
 * @param originalHeight Original height
 * @param maxWidth Maximum width constraint
 * @param maxHeight Maximum height constraint
 * @returns Object with calculated width and height
 */
export const calculateAspectRatioDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
) => {
  if (!originalWidth || !originalHeight) {
    return { width: maxWidth, height: maxHeight };
  }

  const aspectRatio = originalWidth / originalHeight;
  
  // Check if width is the constraining dimension
  if (maxWidth / aspectRatio <= maxHeight) {
    return {
      width: maxWidth,
      height: Math.round(maxWidth / aspectRatio)
    };
  } else {
    // Height is the constraining dimension
    return {
      width: Math.round(maxHeight * aspectRatio),
      height: maxHeight
    };
  }
};

/**
 * Extract the URL from a MediaSource object
 * @param src The media source object or string URL
 * @returns The extracted URL string
 */
export const extractMediaUrl = (src: MediaSource | string): string => {
  if (typeof src === 'string') {
    return src;
  }
  
  if (src && typeof src === 'object' && 'url' in src) {
    return src.url;
  }
  
  return '';
};

/**
 * Get playable media URL with fallbacks
 * @param src The media source object or string URL
 * @returns A playable URL string
 */
export const getPlayableMediaUrl = (src: MediaSource | string): string => {
  const url = extractMediaUrl(src);
  
  // Handle empty URLs
  if (!url) return '';
  
  // Handle already valid URLs
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
    return url;
  }
  
  // Handle relative URLs
  if (url.startsWith('/')) {
    return `${window.location.origin}${url}`;
  }
  
  return url;
};

/**
 * Normalize different media source formats to a consistent MediaSource object
 * @param source The source to normalize (string URL or MediaSource object)
 * @returns Normalized MediaSource object
 */
export const normalizeMediaSource = (source: any): MediaSource => {
  // If it's already a string URL
  if (typeof source === 'string') {
    return {
      url: source,
      type: determineMediaType(source)
    };
  }
  
  // If it's already a proper MediaSource object
  if (source && typeof source === 'object' && 'url' in source) {
    return {
      ...source,
      type: source.type || determineMediaType(source.url)
    };
  }
  
  // If it has media_url property (from API)
  if (source && typeof source === 'object' && 'media_url' in source) {
    const url = Array.isArray(source.media_url) ? source.media_url[0] : source.media_url;
    return {
      url,
      type: source.type || determineMediaType(url),
      poster: source.thumbnail || source.poster,
      thumbnail: source.thumbnail_url || source.thumbnail
    };
  }
  
  // If it has video_url property (common in our system)
  if (source && typeof source === 'object' && 'video_url' in source) {
    return {
      url: source.video_url,
      type: MediaType.VIDEO,
      poster: source.thumbnail_url || source.poster,
      thumbnail: source.thumbnail_url || source.thumbnail
    };
  }
  
  // Fallback for unknown sources
  console.warn('Unknown media source format:', source);
  return {
    url: '',
    type: MediaType.UNKNOWN
  };
};

/**
 * Determine media type from URL or extension
 * @param url The URL to analyze
 * @returns Media type enum value
 */
export const determineMediaType = (url: string): MediaType => {
  if (!url) return MediaType.UNKNOWN;
  
  const lowerUrl = url.toLowerCase();
  
  // Check for image formats
  if (/\.(jpeg|jpg|png|gif|webp|svg|avif)($|\?)/.test(lowerUrl)) {
    return MediaType.IMAGE;
  }
  
  // Check for video formats
  if (/\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)($|\?)/.test(lowerUrl)) {
    return MediaType.VIDEO;
  }
  
  // Check for audio formats
  if (/\.(mp3|wav|ogg|m4a|aac|flac)($|\?)/.test(lowerUrl)) {
    return MediaType.AUDIO;
  }
  
  // Check for document formats
  if (/\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)($|\?)/.test(lowerUrl)) {
    return MediaType.DOCUMENT;
  }
  
  // Special GIF check
  if (lowerUrl.includes('.gif')) {
    return MediaType.GIF;
  }
  
  // Fallback based on common path naming
  if (lowerUrl.includes('/images/') || lowerUrl.includes('/img/')) {
    return MediaType.IMAGE;
  }
  
  if (lowerUrl.includes('/videos/') || lowerUrl.includes('/video/')) {
    return MediaType.VIDEO;
  }
  
  if (lowerUrl.includes('/audio/')) {
    return MediaType.AUDIO;
  }
  
  // Default
  return MediaType.UNKNOWN;
};

/**
 * Create a unique file path for storage
 */
export const createUniqueFilePath = (userId: string, file: File): string => {
  const timestamp = Date.now();
  const uuid = Math.random().toString(36).substring(2, 10);
  const fileExt = file.name.split('.').pop() || '';
  const safeFileName = file.name
    .split('.')[0]
    .replace(/[^a-zA-Z0-9]/g, '_')
    .substring(0, 20);

  return `${userId}/${timestamp}-${uuid}-${safeFileName}.${fileExt}`.toLowerCase();
};

/**
 * Format file size to human-readable format 
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Alias for determineMediaType to fix naming issue
export const detectMediaType = determineMediaType;

/**
 * Upload a file to storage
 */
export const uploadFileToStorage = async (
  bucket: string,
  filePath: string,
  file: File
) => {
  // Import supabase client dynamically to avoid circular dependency
  const { supabase } = await import('@/integrations/supabase/client');
  
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
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

    return { 
      success: true, 
      url: publicUrlData.publicUrl,
      path: data.path
    };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || 'Unknown upload error' 
    };
  }
};

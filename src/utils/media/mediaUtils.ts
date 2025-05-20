
import { MediaSource, MediaType } from './types';

/**
 * Extracts the media URL from a MediaSource object or string
 * @param source The source to extract URL from
 * @returns The extracted URL or empty string
 */
export function extractMediaUrl(source: MediaSource | string | null | undefined): string {
  if (!source) return '';
  
  if (typeof source === 'string') {
    return source;
  }
  
  // Check for url property first (standard)
  if (source.url) {
    return source.url;
  }
  
  // Legacy compatibility checks
  if (source.video_url) {
    return source.video_url;
  }
  
  if (source.media_url) {
    if (Array.isArray(source.media_url) && source.media_url.length > 0) {
      return source.media_url[0];
    }
    return typeof source.media_url === 'string' ? source.media_url : '';
  }
  
  return '';
}

/**
 * Normalizes different media source formats to a standard MediaSource object
 * @param source The source to normalize
 * @returns A normalized MediaSource object
 */
export function normalizeMediaSource(source: MediaSource | string | null | undefined): MediaSource {
  if (!source) {
    return { url: '', type: MediaType.UNKNOWN };
  }
  
  // If it's a string, create a MediaSource object
  if (typeof source === 'string') {
    // Try to determine the type from the URL
    const type = determineMediaTypeFromUrl(source);
    return { 
      url: source,
      type
    };
  }
  
  // It's already a MediaSource-like object
  const normalizedSource: MediaSource = { ...source };
  
  // Ensure url property exists (highest priority)
  if (!normalizedSource.url) {
    if (normalizedSource.video_url) {
      normalizedSource.url = normalizedSource.video_url;
      normalizedSource.type = normalizedSource.type || MediaType.VIDEO;
    } else if (normalizedSource.media_url) {
      const mediaUrl = Array.isArray(normalizedSource.media_url) 
        ? normalizedSource.media_url[0] 
        : normalizedSource.media_url;
      normalizedSource.url = mediaUrl;
      
      // If type isn't already set, try to determine it
      if (!normalizedSource.type) {
        normalizedSource.type = determineMediaTypeFromUrl(mediaUrl);
      }
    }
  }
  
  // Ensure type exists
  if (!normalizedSource.type) {
    normalizedSource.type = normalizedSource.url
      ? determineMediaTypeFromUrl(normalizedSource.url)
      : MediaType.UNKNOWN;
  }
  
  // Handle media_type backward compatibility
  if (normalizedSource.media_type && !normalizedSource.type) {
    normalizedSource.type = normalizedSource.media_type;
  }
  
  return normalizedSource;
}

/**
 * Determines the media type from a URL based on file extension
 * @param url URL to analyze
 * @returns The detected MediaType
 */
export function determineMediaTypeFromUrl(url: string): MediaType {
  if (!url) return MediaType.UNKNOWN;
  
  // Check for video extensions
  if (/\.(mp4|webm|mov|avi|wmv)(\?.*)?$/i.test(url)) {
    return MediaType.VIDEO;
  }
  
  // Check for audio extensions
  if (/\.(mp3|wav|ogg|m4a)(\?.*)?$/i.test(url)) {
    return MediaType.AUDIO;
  }
  
  // Check for image extensions
  if (/\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?.*)?$/i.test(url)) {
    return MediaType.IMAGE;
  }
  
  // Check for common video platforms
  if (url.includes('youtube.com') || url.includes('youtu.be') || 
      url.includes('vimeo.com') || url.includes('dailymotion.com')) {
    return MediaType.VIDEO;
  }
  
  return MediaType.UNKNOWN;
}

/**
 * Creates a thumbnail URL for a video URL
 * @param videoUrl The video URL to create a thumbnail for
 * @returns The thumbnail URL
 */
export function createThumbnailUrl(videoUrl: string): string {
  if (!videoUrl) return '';
  
  // YouTube thumbnail
  const youtubeMatch = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (youtubeMatch && youtubeMatch[1]) {
    return `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`;
  }
  
  // For other videos, default to replacing extension
  return videoUrl.replace(/\.(mp4|webm|mov|avi)$/i, '.jpg');
}

/**
 * Creates options for file upload components
 * @param options Basic options
 * @param additionalOptions Additional options to merge in
 * @returns Combined upload options
 */
export function createUploadOptions(options: {
  bucket?: string;
  folderPath?: string;
  maxSizeInMB?: number;
  allowedTypes?: string[];
}, additionalOptions = {}): any {
  return {
    ...options,
    ...additionalOptions
  };
}

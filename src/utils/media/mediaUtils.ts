
import { MediaSource, MediaType } from './types';

/**
 * Determine the type of media from a URL or MIME type
 */
export function determineMediaType(url: string): MediaType {
  if (!url) return MediaType.UNKNOWN;
  
  // Check for video file extensions
  if (/\.(mp4|webm|mov|avi|wmv|flv|mkv)$/i.test(url)) {
    return MediaType.VIDEO;
  }
  
  // Check for image file extensions
  if (/\.(jpg|jpeg|png|gif|svg|webp|bmp)$/i.test(url)) {
    return MediaType.IMAGE;
  }
  
  // Check for audio file extensions
  if (/\.(mp3|wav|ogg|aac|flac)$/i.test(url)) {
    return MediaType.AUDIO;
  }
  
  // Check for document file extensions
  if (/\.(pdf|doc|docx|xls|xlsx|txt|csv|ppt|pptx)$/i.test(url)) {
    return MediaType.DOCUMENT;
  }
  
  return MediaType.UNKNOWN;
}

/**
 * Extract media URL from various sources
 */
export function extractMediaUrl(source: string | MediaSource): string {
  if (!source) return '';
  
  if (typeof source === 'string') {
    return source;
  }
  
  // Extract from MediaSource object
  if (source.url) {
    return source.url;
  }
  
  // Handle legacy properties
  if (source.video_url) {
    return source.video_url;
  }
  
  if (source.media_url) {
    if (Array.isArray(source.media_url) && source.media_url.length > 0) {
      return source.media_url[0];
    }
    return source.media_url as string;
  }
  
  if (source.media_urls && Array.isArray(source.media_urls) && source.media_urls.length > 0) {
    return source.media_urls[0];
  }
  
  if (source.video_urls && Array.isArray(source.video_urls) && source.video_urls.length > 0) {
    return source.video_urls[0];
  }
  
  return '';
}

/**
 * Create a unique file path for uploading
 */
export function createUniqueFilePath(folderPath: string, fileName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  
  // Extract file extension
  const extension = fileName.split('.').pop() || '';
  
  // Create file name without extension
  const baseName = fileName.replace(`.${extension}`, '');
  
  // Create a cleaned up name (remove special characters)
  const cleanName = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 30);
  
  // Return the unique path
  return `${folderPath}/${cleanName}-${timestamp}-${randomString}.${extension}`;
}

/**
 * Normalize media source to ensure it has the required properties
 */
export function normalizeMediaSource(source: string | MediaSource): MediaSource {
  if (typeof source === 'string') {
    // If source is just a string (URL), convert it to a MediaSource object
    const mediaType = determineMediaType(source);
    return {
      url: source,
      type: mediaType
    };
  }
  
  // For MediaSource objects, ensure required properties exist
  const normalizedSource: MediaSource = {
    url: '',
    type: MediaType.UNKNOWN,
    ...source
  };
  
  // Handle legacy properties and make sure url is set
  if (!normalizedSource.url) {
    if (source.video_url) {
      normalizedSource.url = source.video_url;
      normalizedSource.type = MediaType.VIDEO;
    } else if (source.media_url) {
      if (Array.isArray(source.media_url) && source.media_url.length > 0) {
        normalizedSource.url = source.media_url[0];
      } else {
        normalizedSource.url = source.media_url as string;
      }
      
      if (!normalizedSource.type || normalizedSource.type === MediaType.UNKNOWN) {
        normalizedSource.type = determineMediaType(normalizedSource.url);
      }
    } else if (source.media_urls && Array.isArray(source.media_urls) && source.media_urls.length > 0) {
      normalizedSource.url = source.media_urls[0];
      if (!normalizedSource.type || normalizedSource.type === MediaType.UNKNOWN) {
        normalizedSource.type = determineMediaType(normalizedSource.url);
      }
    } else if (source.video_urls && Array.isArray(source.video_urls) && source.video_urls.length > 0) {
      normalizedSource.url = source.video_urls[0];
      normalizedSource.type = MediaType.VIDEO;
    }
  }
  
  // If type is not explicitly set, try to determine it from the URL
  if (!normalizedSource.type || normalizedSource.type === MediaType.UNKNOWN) {
    normalizedSource.type = determineMediaType(normalizedSource.url);
  }
  
  return normalizedSource;
}

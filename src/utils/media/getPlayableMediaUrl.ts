
import { addCacheBuster } from './urlUtils';

/**
 * A union type representing the different formats media URL can be stored in
 */
export interface MediaSource {
  media_url?: string | string[] | null;
  video_url?: string | null;
  video_urls?: string[] | null;
  url?: string | null;
  src?: string | null;
  content_type?: string; 
  media_type?: string;
  poster_url?: string | null;
}

/**
 * Extract and format media URL from various source objects
 * This function handles all the different ways media URLs might be stored
 */
export const getPlayableMediaUrl = (source: MediaSource | string | null | undefined): string => {
  // Handle direct string URLs
  if (typeof source === 'string') {
    return addCacheBuster(source);
  }
  
  // Handle null/undefined cases
  if (!source) return '';
  
  // Extract URL from source object based on available properties
  let mediaUrl: string | null = null;
  
  // Handle media_url which could be an array or string
  if (source.media_url) {
    if (Array.isArray(source.media_url) && source.media_url.length > 0) {
      mediaUrl = source.media_url[0];
    } else if (typeof source.media_url === 'string') {
      mediaUrl = source.media_url;
    }
  }
  
  // If no media_url, try video_url
  if (!mediaUrl && source.video_url) {
    mediaUrl = source.video_url;
  }
  
  // If no video_url, try video_urls array
  if (!mediaUrl && source.video_urls && Array.isArray(source.video_urls) && source.video_urls.length > 0) {
    mediaUrl = source.video_urls[0];
  }
  
  // Try generic url or src properties
  if (!mediaUrl) {
    mediaUrl = source.url || source.src || '';
  }
  
  // Apply cache busting to prevent stale content
  return addCacheBuster(mediaUrl || '');
};

/**
 * Determine if media source is likely a video based on URL or content type
 */
export const isVideoContent = (source: MediaSource | string | null | undefined): boolean => {
  // Handle string URLs
  if (typeof source === 'string') {
    const url = source.toLowerCase();
    return url.includes('.mp4') || 
           url.includes('.webm') || 
           url.includes('.mov') || 
           url.includes('video');
  }
  
  // Handle null/undefined
  if (!source) return false;
  
  // Check explicit content/media type properties
  if (source.content_type === 'video' || source.media_type === 'video') {
    return true;
  }
  
  // Check for video_url or video_urls properties
  if (source.video_url || (source.video_urls && source.video_urls.length > 0)) {
    return true;
  }
  
  // Check URL extensions for media_url
  if (source.media_url) {
    const url = Array.isArray(source.media_url) 
      ? source.media_url[0] || '' 
      : source.media_url || '';
    
    const lowercaseUrl = url.toLowerCase();
    return lowercaseUrl.includes('.mp4') || 
           lowercaseUrl.includes('.webm') || 
           lowercaseUrl.includes('.mov') || 
           lowercaseUrl.includes('video');
  }
  
  return false;
};

// Export addCacheBuster from this file as well for better compatibility
export { addCacheBuster } from './urlUtils';


import { MediaSource } from './types';

/**
 * Gets a clean URL from a media source
 */
export const getMediaUrl = (source: string | MediaSource | undefined | null): string => {
  if (!source) return '';
  
  if (typeof source === 'string') {
    return cleanUrl(source);
  }
  
  // Check for different URL properties in order of preference
  const url = 
    source.url || 
    source.video_url || 
    source.media_url || 
    source.image_url || 
    source.thumbnail_url ||
    source.src ||
    '';
    
  return cleanUrl(url);
};

/**
 * Gets a thumbnail URL from a media source
 */
export const getThumbnailUrl = (source: string | MediaSource | undefined | null): string => {
  if (!source) return '';
  
  if (typeof source === 'string') {
    return cleanUrl(source);
  }
  
  // Check for thumbnail properties in order of preference
  const url = 
    source.thumbnail_url || 
    source.image_url || 
    source.media_url || 
    source.url ||
    source.src ||
    '';
    
  return cleanUrl(url);
};

/**
 * Clean and validate a URL string
 */
export const cleanUrl = (url: string): string => {
  if (!url) return '';
  
  // Handle data URLs as is
  if (url.startsWith('data:')) {
    return url;
  }
  
  // Handle relative URLs
  if (url.startsWith('/')) {
    return url;
  }
  
  // Add https if protocol is missing
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  
  return url;
};

/**
 * Check if the URL is for media content
 */
export const isMediaUrl = (url: string): boolean => {
  if (!url) return false;
  
  // Check if it's a data URL for media
  if (url.startsWith('data:image/') || 
      url.startsWith('data:video/') || 
      url.startsWith('data:audio/')) {
    return true;
  }
  
  // Check for common media file extensions
  const mediaExtensions = /\.(jpg|jpeg|png|gif|webp|svg|mp4|webm|mov|mp3|wav|ogg)($|\?)/i;
  return mediaExtensions.test(url);
};

/**
 * Get URL from a media source with fallbacks
 */
export const getUrlWithFallbacks = (source: MediaSource | string | null | undefined): string => {
  if (!source) return '';
  
  // For string sources, just return directly
  if (typeof source === 'string') return source;
  
  // For object sources, try various properties
  return source.url || 
         source.video_url || 
         source.media_url || 
         source.image_url || 
         source.thumbnail_url || 
         source.src ||
         (source.video_urls?.length ? source.video_urls[0] : '') || 
         (source.media_urls?.length ? source.media_urls[0] : '') || 
         '';
};

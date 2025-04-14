
import { addCacheBuster as addCacheBusterUtil } from "./urlUtils";

interface MediaItem {
  media_url?: string;
  video_url?: string;
  poster_url?: string;
  media_type?: string;
  content_type?: string;
  creator_id?: string;
  [key: string]: any;
}

/**
 * Get a playable media URL from various item formats
 * This function handles different property names and formats
 * to ensure we get a valid URL
 */
export const getPlayableMediaUrl = (item: MediaItem | null | undefined): string | null => {
  if (!item) return null;
  
  // Try different property names to find a valid URL
  let url = item.media_url || item.video_url || null;
  
  // For backward compatibility
  if (!url && 'url' in item) {
    url = item.url;
  }
  
  if (!url) return null;
  
  // For arrays, take the first item
  if (Array.isArray(url) && url.length > 0) {
    url = url[0];
  }
  
  return url;
};

/**
 * Add cache busting parameters to URLs while preventing recursive additions
 * IMPORTANT: This function checks if a URL already has cache busting parameters
 * to avoid adding them multiple times
 */
export const addCacheBuster = (url: string | null): string | null => {
  if (!url) return null;
  
  // Don't add cache busters to blob URLs or data URLs
  if (url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  
  // If URL already has our specific cache-busting parameters, don't add more
  if (url.includes('t=') && url.includes('r=')) {
    return url;
  }
  
  // Generate a timestamp and a unique identifier
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  
  // Add the cache busting parameters
  return url.includes('?') ? 
    `${url}&t=${timestamp}&r=${random}` : 
    `${url}?t=${timestamp}&r=${random}`;
};

/**
 * Get the poster URL for a video
 */
export const getPosterUrl = (item: MediaItem | null): string | null => {
  if (!item) return null;
  
  return item.poster_url || null;
};

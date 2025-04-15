
import { debugMediaUrl } from "./debugMediaUtils";

/**
 * Prepares a URL for playback by handling different URL formats and special cases
 * This is useful for ensuring videos and images load efficiently
 */
export const getPlayableMediaUrl = (item: { 
  media_url?: string | null; 
  video_url?: string | null;
} | string) => {
  try {
    let url: string | null = null;
    
    // Handle string input
    if (typeof item === 'string') {
      url = item;
    }
    // Handle object input
    else if (item) {
      url = item.video_url || item.media_url || null;
    }
    
    // If no URL found, return null
    if (!url) return null;
    
    // If URL already contains a cache-busting parameter, use it as is
    if (url.includes('?') && (url.includes('t=') || url.includes('v='))) {
      return url;
    }
    
    // Unsure how this got here, but let's fix it
    if (url.includes('?generateCacheKey')) {
      url = url.split('?generateCacheKey')[0];
    }
    
    // Return the clean URL
    return url;
  } catch (error) {
    console.error("Error in getPlayableMediaUrl:", error);
    
    // If we're debugging, track the error
    if (process.env.NODE_ENV === 'development') {
      const urlString = typeof item === 'string' ? item : (item.video_url || item.media_url || null);
      if (urlString) {
        debugMediaUrl(urlString);
      }
    }
    
    // Return null on error
    return null;
  }
};

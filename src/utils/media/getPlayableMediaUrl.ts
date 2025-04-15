
/**
 * @deprecated Use the consolidated mediaUtils.ts instead
 * This file is kept for backward compatibility but should be replaced with mediaUtils.ts
 */

import { getPlayableMediaUrl as getMediaUrl } from "./mediaUtils";
import { debugMediaUrl } from "./debugMediaUtils";

/**
 * Prepares a URL for playback by handling different URL formats and special cases
 * This is useful for ensuring videos and images load efficiently
 * @deprecated Use mediaUtils.getPlayableMediaUrl instead
 */
export const getPlayableMediaUrl = (item: { 
  media_url?: string | null; 
  video_url?: string | null;
} | string) => {
  try {
    // Forward to the consolidated implementation
    return getMediaUrl(item);
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

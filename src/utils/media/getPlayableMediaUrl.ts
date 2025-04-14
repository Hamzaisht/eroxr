
import { getDisplayableMediaUrl } from "./urlUtils";

/**
 * Get a playable media URL for the given item
 * This is a wrapper around getDisplayableMediaUrl that accepts different input types
 */
export const getPlayableMediaUrl = (
  item: string | { 
    video_url?: string | null; 
    media_url?: string | null;
    url?: string | null;
  }
): string => {
  // Handle direct string input
  if (typeof item === 'string') {
    return getDisplayableMediaUrl(item);
  }
  
  // Extract URL from object based on common properties
  const url = item.video_url || item.media_url || item.url || '';
  return getDisplayableMediaUrl(url);
};

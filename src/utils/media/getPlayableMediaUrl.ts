
import { getDirectMediaUrl, extractMediaUrl } from "./mediaUrlUtils";
import { getStoragePublicUrl } from "./storageUtils";
import { MediaSource } from "./types";

/**
 * A unified utility to process media URLs for playback
 * Consolidates functionality from various media utilities
 */
export const getPlayableMediaUrl = (source: MediaSource | string): string => {
  // First extract a URL from possibly complex media objects
  let url = typeof source === 'string' ? source : extractMediaUrl(source);
  
  // If we couldn't get a URL, return empty string
  if (!url) return '';
  
  // For storage paths, convert to public URLs
  if (!url.startsWith('http') && !url.startsWith('blob:') && !url.startsWith('data:')) {
    const publicUrl = getStoragePublicUrl(url);
    if (publicUrl) {
      url = publicUrl;
    }
  }
  
  // Final processing to ensure direct playability
  return getDirectMediaUrl(url);
};

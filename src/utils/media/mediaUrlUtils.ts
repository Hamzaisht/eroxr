
import { MediaType } from './types';

/**
 * Get a playable URL for media sources
 * This function handles cases where URLs might need modification
 * to work correctly across different browsers and devices
 */
export const getPlayableMediaUrl = (url: string | null): string | null => {
  if (!url) return null;
  
  // Handle special cases like direct auth links, storage URLs etc.
  // For now, just return the URL as is
  return url;
};

/**
 * Get an appropriate thumbnail URL based on media type
 */
export const getThumbnailUrl = (source: { 
  url?: string; 
  thumbnail_url?: string; 
  media_type?: MediaType;
}): string | null => {
  // Return thumbnail URL if available
  if (source.thumbnail_url) return source.thumbnail_url;
  
  // For now just return the main URL for images
  if (source.media_type === MediaType.IMAGE && source.url) {
    return source.url;
  }
  
  return null;
};

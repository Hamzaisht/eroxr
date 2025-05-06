
/**
 * Extracts the best available URL from a media object with different possible URL formats
 * 
 * @param media The media object or string URL
 * @returns The resolved URL or null if none found
 */
export const extractMediaUrl = (media: any): string | null => {
  if (!media) return null;
  
  // Handle if media is a simple string URL
  if (typeof media === 'string') return media;
  
  // Try to extract URL from object with various URL properties
  const url = media.url || 
              media.media_url || 
              media.video_url ||
              media.src ||
              (media.video_urls && media.video_urls[0]) ||
              (media.media_urls && media.media_urls[0]) ||
              media.thumbnail_url;
              
  return url || null;
};

/**
 * Gets a playable media URL, adding cache-busting or other parameters as needed
 * 
 * @param url The raw media URL
 * @returns The processed URL ready for playback
 */
export const getPlayableMediaUrl = (url: string | null): string => {
  if (!url) return '';
  
  // Add cache busting for development environment
  if (process.env.NODE_ENV === 'development') {
    const cacheBuster = `_cb=${Date.now()}`;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${cacheBuster}`;
  }
  
  return url;
};

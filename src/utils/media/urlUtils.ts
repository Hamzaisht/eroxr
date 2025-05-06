
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

/**
 * Gets the file extension from a URL or path
 */
export function getFileExtension(url: string): string | null {
  if (!url) return null;
  
  try {
    // Handle data URIs separately
    if (url.startsWith('data:')) {
      const match = url.match(/data:([a-z]+)\/([a-z0-9.+-]+);/i);
      return match ? match[2].toLowerCase() : null;
    }

    // Extract filename from URL or path and handle query params
    const urlWithoutParams = url.split('?')[0];
    const filename = urlWithoutParams.split('/').pop() || '';
    
    // Extract extension
    const parts = filename.split('.');
    if (parts.length <= 1) return null;
    
    return parts.pop()?.toLowerCase() || null;
  } catch (error) {
    console.error("Error getting file extension:", error);
    return null;
  }
}

/**
 * Checks if a URL is an image URL based on extension
 */
export function isImageUrl(url: string): boolean {
  if (!url) return false;
  
  // Handle data URIs
  if (url.startsWith('data:image/')) return true;
  
  const extension = getFileExtension(url);
  if (!extension) return false;
  
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff'];
  return imageExtensions.includes(extension);
}

/**
 * Checks if a URL is a video URL based on extension
 */
export function isVideoUrl(url: string): boolean {
  if (!url) return false;
  
  // Handle data URIs
  if (url.startsWith('data:video/')) return true;
  
  const extension = getFileExtension(url);
  if (!extension) return false;
  
  const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'wmv', 'flv', 'mkv'];
  return videoExtensions.includes(extension);
}

/**
 * Checks if a URL is an audio URL based on extension
 */
export function isAudioUrl(url: string): boolean {
  if (!url) return false;
  
  // Handle data URIs
  if (url.startsWith('data:audio/')) return true;
  
  const extension = getFileExtension(url);
  if (!extension) return false;
  
  const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a', 'wma'];
  return audioExtensions.includes(extension);
}

/**
 * Adds a cache busting parameter to a URL
 * @param url - The URL to add the cache buster to
 * @returns The URL with a cache buster parameter
 */
export function addCacheBuster(url: string): string {
  try {
    // Generate a more stable cache buster that doesn't change on every reload
    const hourTimestamp = Math.floor(Date.now() / 3600000); // Changes only once per hour
    const contentHash = url
      .split('')
      .reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) & 0xFFFFFFFF, 0)
      .toString(36);
      
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}cb=${hourTimestamp}-${contentHash}`;
  } catch (error) {
    console.error("Error adding cache buster:", error);
    return url;
  }
}


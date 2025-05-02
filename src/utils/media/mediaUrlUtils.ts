
/**
 * Comprehensive media URL utilities
 * This is the single source of truth for URL processing in the application
 */

/**
 * Adds cache busting parameter to URL
 * @param url - The URL to add the cache buster to
 * @returns The URL with a cache buster parameter
 */
export function addCacheBuster(url: string): string {
  if (!url) return url;
  
  const separator = url.includes('?') ? '&' : '?';
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${url}${separator}cb=${timestamp}-${random}`;
}

/**
 * Normalizes a URL to ensure it has a proper protocol
 * @param url - The URL to normalize
 * @returns A normalized URL with proper protocol
 */
export function normalizeUrl(url: string | null | undefined): string {
  if (!url) return '';
  
  // Handle special URLs
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  
  // Handle URL without protocol
  if (url.startsWith('//')) {
    return `https:${url}`;
  }
  
  // Add protocol if missing
  if (!url.startsWith('http') && !url.startsWith('blob:') && !url.startsWith('data:')) {
    return `https://${url}`;
  }
  
  return url;
}

/**
 * Extracts the file extension from a URL
 * @param url - The URL to extract the extension from
 * @returns The file extension or empty string if none found
 */
export function getFileExtension(url: string | null | undefined): string {
  if (!url) return '';
  
  const parts = url.split('.');
  if (parts.length <= 1) return '';
  
  // Get the last part and remove any query parameters
  const lastPart = parts[parts.length - 1].split('?')[0].split('#')[0];
  return lastPart.toLowerCase();
}

/**
 * Determines if a URL is likely an image based on its extension
 * @param url - The URL to check
 * @returns True if the URL is likely an image, false otherwise
 */
export function isImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  const ext = getFileExtension(url);
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext);
}

/**
 * Determines if a URL is likely a video based on its extension
 * @param url - The URL to check
 * @returns True if the URL is likely a video, false otherwise
 */
export function isVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  const ext = getFileExtension(url);
  return ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'flv'].includes(ext);
}

/**
 * Determines if a URL is likely an audio file based on its extension
 * @param url - The URL to check
 * @returns True if the URL is likely an audio file, false otherwise
 */
export function isAudioUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  const ext = getFileExtension(url);
  return ['mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac'].includes(ext);
}

/**
 * Extracts a media URL from various source formats
 * @param source - The source object or string
 * @returns The extracted URL or empty string
 */
export function extractMediaUrl(source: any): string {
  if (!source) return '';
  
  // Direct string URL
  if (typeof source === 'string') {
    return source;
  }
  
  // Extract from media object with priority order
  const extractedUrl = 
    // Try video URLs first
    (source.video_url) || 
    (Array.isArray(source.video_urls) && source.video_urls.length > 0 ? source.video_urls[0] : '') ||
    // Then try media URLs
    (source.media_url) || 
    (Array.isArray(source.media_urls) && source.media_urls.length > 0 ? source.media_urls[0] : '') ||
    // Finally try generic URL properties
    (source.url) || 
    (source.src) || 
    '';
    
  return extractedUrl;
}

/**
 * Gets a playable media URL with proper formatting and cache busting
 * This is the definitive function for preparing media URLs across the app
 * @param source - The source to get the URL from (string or object)
 * @returns A fully processed URL ready for playback
 */
export function getPlayableMediaUrl(source: any): string {
  // Extract the URL from the source
  const extractedUrl = extractMediaUrl(source);
  if (!extractedUrl) return '';
  
  // Normalize the URL (ensure proper protocol)
  const normalizedUrl = normalizeUrl(extractedUrl);
  
  // Add cache busting to help with media loading issues
  return addCacheBuster(normalizedUrl);
}

export default getPlayableMediaUrl;

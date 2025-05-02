
/**
 * Adds a cache busting parameter to a URL
 * @param url - The URL to add the cache buster to
 * @returns The URL with a cache buster parameter
 */
export function addCacheBuster(url: string): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}cb=${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
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
 * Creates a URL for a file object
 * @param file - The file to create a URL for
 * @returns A URL for the file
 */
export function createObjectUrl(file: File | Blob): string {
  return URL.createObjectURL(file);
}

/**
 * Revokes a URL created with URL.createObjectURL
 * @param url - The URL to revoke
 */
export function revokeObjectUrl(url: string): void {
  URL.revokeObjectURL(url);
}

/**
 * Gets a playable media URL with cache busting if needed
 * @param url - The URL to process
 * @returns The processed URL ready for playback
 */
export function getPlayableMediaUrl(url: string | undefined | null): string {
  if (!url) return '';
  
  // Add cache busting to help with media loading issues
  return addCacheBuster(url);
}

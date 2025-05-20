
/**
 * Adds a cache buster to a URL to prevent caching
 * @param url The URL to add a cache buster to
 */
export function addCacheBuster(url: string): string {
  if (!url) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_cb=${Date.now()}`;
}

/**
 * Checks if a URL is a valid media URL
 * @param url The URL to check
 */
export function isValidMediaUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.startsWith('http') || url.startsWith('/');
}

/**
 * Get a playable media URL with cache busting if needed
 * @param url The media URL
 */
export function getPlayableMediaUrl(url: string | null | undefined): string {
  if (!url) return '';
  return addCacheBuster(url);
}

/**
 * Check if a URL is a video URL
 * @param url The URL to check
 */
export function isVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv'];
  return videoExtensions.some(ext => url.toLowerCase().includes(ext));
}

/**
 * Check if a URL is an image URL
 * @param url The URL to check
 */
export function isImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  return imageExtensions.some(ext => url.toLowerCase().includes(ext));
}

/**
 * Check if a URL is an audio URL
 * @param url The URL to check
 */
export function isAudioUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.flac'];
  return audioExtensions.some(ext => url.toLowerCase().includes(ext));
}

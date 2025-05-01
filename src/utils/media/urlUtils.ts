
/**
 * Gets a playable media URL from a source URL
 * This function can handle different URL formats, CDNs, etc.
 */
export function getPlayableMediaUrl(url: string): string {
  if (!url) return '';
  
  // Return the URL as is, but this could be extended to handle:
  // - CDN transformations
  // - Authorization tokens
  // - Protocol changes
  // - Proxy endpoints
  return url;
}

/**
 * Creates a thumbnail URL from a video URL
 */
export function getThumbnailUrl(videoUrl: string): string {
  // In a real implementation, this could generate thumbnails from videos
  // For now, just return an empty string
  return '';
}

/**
 * Gets the file extension from a URL
 */
export function getFileExtension(url: string): string {
  if (!url) return '';
  
  const filename = url.split('/').pop() || '';
  const extension = filename.split('.').pop() || '';
  
  return extension.toLowerCase();
}

/**
 * Adds a cache-busting parameter to a URL
 */
export function addCacheBuster(url: string): string {
  if (!url) return '';
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}cache=${Date.now()}`;
}

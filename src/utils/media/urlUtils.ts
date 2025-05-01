
/**
 * Utility functions for handling media URLs
 */

/**
 * Adds a cache busting parameter to a URL
 */
export function addCacheBuster(url: string): string {
  if (!url) return url;
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_cb=${Date.now()}`;
}

/**
 * Gets the absolute URL for a relative path
 */
export function getAbsoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  
  const baseUrl = window.location.origin;
  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
}

/**
 * Determines if a URL is external to the current domain
 */
export function isExternalUrl(url: string): boolean {
  if (!url || !url.startsWith('http')) return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.hostname !== window.location.hostname;
  } catch (e) {
    return false;
  }
}

/**
 * Extracts thumbnail URL from a video URL
 */
export function getVideoThumbnail(videoUrl: string): string {
  // Common video platforms
  if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
    const videoId = extractYoutubeId(videoUrl);
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  
  // For local videos, we could potentially create a thumbnail as a separate process
  // For now just return the video URL
  return videoUrl;
}

/**
 * Extracts YouTube video ID from URL
 */
function extractYoutubeId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : '';
}

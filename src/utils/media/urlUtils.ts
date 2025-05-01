
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
 * Gets a playable media URL (handles caching, CDN issues, etc)
 * This function was missing and causing build errors
 */
export function getPlayableMediaUrl(url: string): string {
  if (!url) return '';
  
  // Handle special URLs
  if (url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  
  // Handle already processed URLs
  if (url.includes('supabase.co/storage/v1/object/public/')) {
    return url;
  }
  
  // Handle relative URLs
  if (url.startsWith('/')) {
    return getAbsoluteUrl(url);
  }
  
  // For other URLs, add cache busting
  return addCacheBuster(url);
}

/**
 * Gets the file extension from a URL or filename
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Convert a relative URL to absolute URL
 */
export function toAbsoluteUrl(url: string): string {
  return getAbsoluteUrl(url);
}

/**
 * Extracts YouTube video ID from URL
 */
export function extractYoutubeId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : '';
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

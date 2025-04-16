
/**
 * URL utilities for media files
 */

/**
 * Ensure a URL is a full URL with protocol
 */
export function ensureFullUrl(url: string): string {
  if (!url) return '';
  
  // If the URL starts with a protocol, it's already a full URL
  if (url.match(/^https?:\/\//)) {
    return url;
  }
  
  // Check if it's a relative path starting with a slash
  if (url.startsWith('/')) {
    return `${window.location.origin}${url}`;
  }
  
  // If it doesn't have a protocol, assume it's https
  return `https://${url}`;
}

/**
 * Generate a URL with cache busting to prevent caching issues
 */
export function addCacheBuster(url: string): string {
  if (!url) return url;
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const separator = url.includes('?') ? '&' : '?';
  
  return `${url}${separator}cache=${timestamp}-${random}`;
}

/**
 * Get a playable media URL with cache busting if needed
 */
export function getPlayableMediaUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  
  // Ensure it's a full URL
  let fullUrl = ensureFullUrl(url);
  
  // Add cache busting to ensure fresh content
  return addCacheBuster(fullUrl);
}

/**
 * Check if a URL points to an image based on file extension or media type
 */
export function isImageUrl(url: string): boolean {
  if (!url) return false;
  const lowercaseUrl = url.toLowerCase();
  return /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(lowercaseUrl);
}

/**
 * Check if a URL points to a video based on file extension
 */
export function isVideoUrl(url: string): boolean {
  if (!url) return false;
  const lowercaseUrl = url.toLowerCase();
  return /\.(mp4|webm|ogv|mov|avi|m4v)$/i.test(lowercaseUrl);
}

/**
 * Check if a URL points to an audio file based on file extension
 */
export function isAudioUrl(url: string): boolean {
  if (!url) return false;
  const lowercaseUrl = url.toLowerCase();
  return /\.(mp3|wav|ogg|flac|aac)$/i.test(lowercaseUrl);
}

/**
 * Create a thumbnail URL from a video URL if supported platform
 */
export function getVideoThumbnailUrl(videoUrl: string): string | null {
  if (!videoUrl) return null;
  
  // YouTube thumbnail
  const youtubeMatch = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (youtubeMatch && youtubeMatch[1]) {
    return `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`;
  }
  
  // For other videos, we can't generate thumbnails client-side without loading the video
  return null;
}

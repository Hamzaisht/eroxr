
/**
 * Extract the media URL from a string or media object
 */
export function extractMediaUrl(source: any): string | null {
  if (!source) return null;
  
  // Handle string source
  if (typeof source === 'string') {
    return source;
  }
  
  // Handle media object with various URL properties
  return source.url || source.video_url || source.media_url || source.src || null;
}

/**
 * Get a playable media URL (handles CDN transformations, proxies, etc)
 */
export function getPlayableMediaUrl(url: string): string {
  if (!url) return '';
  
  // Add CORS proxy for external URLs if needed
  if (
    url.startsWith('http') && 
    !url.includes(window.location.hostname) &&
    !url.includes('localhost') &&
    !url.includes('storage.googleapis.com') &&
    !url.includes('supabase')
  ) {
    // You can add CORS proxy logic here if needed
    // For now we just return the URL as is
  }
  
  return url;
}

/**
 * Add a cache buster parameter to a URL
 */
export function addCacheBuster(url: string): string {
  if (!url) return url;
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
}

/**
 * Check if URL points to an image
 */
export function isImageUrl(url: string): boolean {
  if (!url) return false;
  
  const extension = url.split('.').pop()?.toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension || '');
}

/**
 * Check if URL points to a video
 */
export function isVideoUrl(url: string): boolean {
  if (!url) return false;
  
  const extension = url.split('.').pop()?.toLowerCase();
  return ['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(extension || '');
}

/**
 * Check if URL points to an audio file
 */
export function isAudioUrl(url: string): boolean {
  if (!url) return false;
  
  const extension = url.split('.').pop()?.toLowerCase();
  return ['mp3', 'wav', 'ogg'].includes(extension || '');
}

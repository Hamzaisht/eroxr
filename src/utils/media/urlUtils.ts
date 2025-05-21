
/**
 * Get a playable media URL with cache busting
 */
export function getPlayableMediaUrl(url: string): string {
  if (!url) return '';
  
  // Add cache busting for certain storage URLs
  if ((url.includes('storage/v1/object') || url.includes('cloudfront.net')) && !url.includes('?t=')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${Date.now()}`;
  }
  
  return url;
}

/**
 * Check if URL points to a video file
 */
export function isVideoUrl(url: string): boolean {
  if (!url) return false;
  
  // Check by file extension in the URL
  const hasVideoExtension = /\.(mp4|webm|mov|avi|wmv|flv|mkv)($|\?)/i.test(url);
  
  // Check by content type in URL if it exists
  const hasVideoContentType = url.includes('video/');
  
  return hasVideoExtension || hasVideoContentType;
}

/**
 * Check if URL points to an image file
 */
export function isImageUrl(url: string): boolean {
  if (!url) return false;
  
  // Check by file extension in the URL
  const hasImageExtension = /\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)($|\?)/i.test(url);
  
  // Check by content type in URL if it exists
  const hasImageContentType = url.includes('image/');
  
  return hasImageExtension || hasImageContentType;
}

/**
 * Check if URL points to an audio file
 */
export function isAudioUrl(url: string): boolean {
  if (!url) return false;
  
  // Check by file extension in the URL
  const hasAudioExtension = /\.(mp3|wav|ogg|aac|flac|m4a)($|\?)/i.test(url);
  
  // Check by content type in URL if it exists
  const hasAudioContentType = url.includes('audio/');
  
  return hasAudioExtension || hasAudioContentType;
}

/**
 * Checks if a URL is valid
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Gets an optimized image URL (for thumbnails, etc)
 */
export function getOptimizedImageUrl(url: string, options?: { width?: number; height?: number; quality?: number }): string {
  if (!url) return '';
  
  // For now, we just return the original URL
  // In a real implementation, you might append dimensions and quality parameters
  // for image CDNs or resizing services
  return url;
}

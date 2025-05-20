
/**
 * Converts any media URL to a safe, playable URL format
 * @param url The URL to convert
 * @returns A playable URL
 */
export function getPlayableMediaUrl(url: string): string {
  if (!url) return '';

  // Handle URLs that might need processing - add more as needed
  if (url.includes('cloudfront.net') && !url.includes('?')) {
    return `${url}?t=${Date.now()}`; // Add cache-busting for CloudFront
  }
  
  // Remove query string for video URLs if they might cause issues
  if (url.match(/\.(mp4|webm|mov)($|\?)/i) && url.includes('?')) {
    return url.split('?')[0];
  }

  return url;
}

/**
 * Determines if a URL is valid
 * @param url URL to check
 * @returns Boolean indicating if URL is valid
 */
export function isValidMediaUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Gets a thumbnail URL from a video URL
 * @param videoUrl Video URL
 * @returns Thumbnail URL or null
 */
export function getThumbnailFromVideo(videoUrl: string): string | null {
  if (!videoUrl) return null;
  
  // For cloud storage URLs, try to get the thumbnail
  if (videoUrl.includes('cloudfront.net') || videoUrl.includes('storage.googleapis.com')) {
    return videoUrl.replace(/\.(mp4|webm|mov)$/i, '.jpg');
  }
  
  // For YouTube videos
  const youtubeMatch = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (youtubeMatch && youtubeMatch[1]) {
    return `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`;
  }
  
  return null;
}

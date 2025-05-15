
/**
 * Gets a playable URL for media content, handling CDN transformations if needed
 * @param url Original media URL
 * @returns A URL that can be used for playback
 */
export const getPlayableMediaUrl = (url: string | undefined | null): string | null => {
  if (!url) return null;
  
  // Handle relative URLs
  if (url.startsWith('/')) {
    return url;
  }
  
  // Return the URL as-is for now
  // In a real implementation, this could apply CDN transformations or other processing
  return url;
};

/**
 * Gets a thumbnail URL for video content
 * @param videoUrl The video URL
 * @returns A URL for the video thumbnail
 */
export const getVideoThumbnailUrl = (videoUrl: string | undefined | null): string | null => {
  if (!videoUrl) return null;
  
  // For now, just return the video URL
  // In a real implementation, this could generate or fetch a thumbnail
  return videoUrl;
};

/**
 * Creates an optimized URL for responsive images
 * @param imageUrl Original image URL
 * @param width Desired width
 * @param height Desired height
 * @returns Optimized image URL
 */
export const getResponsiveImageUrl = (
  imageUrl: string | undefined | null,
  width?: number,
  height?: number
): string | null => {
  if (!imageUrl) return null;
  
  // Basic implementation - would be replaced with actual CDN parameters
  // in a production environment
  return imageUrl;
};

/**
 * Determine if a URL is an external URL (not from our domain)
 */
export const isExternalUrl = (url: string | undefined | null): boolean => {
  if (!url) return false;
  if (url.startsWith('/')) return false;
  
  try {
    const currentDomain = window.location.hostname;
    const urlObj = new URL(url);
    return urlObj.hostname !== currentDomain;
  } catch (e) {
    // If URL parsing fails, assume it's not external
    return false;
  }
};

/**
 * Create a URL for an avatar with the given size
 */
export const getAvatarUrl = (
  url: string | undefined | null, 
  size: number = 64
): string | null => {
  if (!url) return null;
  
  // Basic implementation - would be replaced with actual CDN parameters
  // in a production environment
  return url;
};

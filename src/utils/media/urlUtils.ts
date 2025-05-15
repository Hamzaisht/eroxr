/**
 * Converts a media URL to a playable URL
 * This may include adding query parameters or modifying the URL for different services
 */
export const getPlayableMediaUrl = (url: string | undefined | null): string => {
  if (!url) return '';
  
  // Handle relative URLs
  if (url.startsWith('/')) {
    return url;
  }
  
  // Return the URL as-is for now
  // In a real implementation, this could apply CDN transformations or other processing
  return url;
};

/**
 * Determines if a given URL is pointing to a video resource
 */
export const isVideoUrl = (url: string): boolean => {
  if (!url) return false;
  
  const lowerUrl = url.toLowerCase();
  
  // Check file extensions
  if (
    lowerUrl.endsWith('.mp4') ||
    lowerUrl.endsWith('.webm') ||
    lowerUrl.endsWith('.mov') ||
    lowerUrl.endsWith('.avi') ||
    lowerUrl.endsWith('.mkv')
  ) {
    return true;
  }
  
  // Check for video service URLs
  if (
    lowerUrl.includes('youtube.com/watch') ||
    lowerUrl.includes('youtu.be/') ||
    lowerUrl.includes('vimeo.com/') ||
    lowerUrl.includes('dailymotion.com/video/')
  ) {
    return true;
  }
  
  // Check if URL contains hints about being a video
  if (lowerUrl.includes('/video/') || lowerUrl.includes('video=')) {
    return true;
  }
  
  return false;
};

/**
 * Determines if a given URL is pointing to an image resource
 */
export const isImageUrl = (url: string): boolean => {
  if (!url) return false;
  
  const lowerUrl = url.toLowerCase();
  
  // Check file extensions
  if (
    lowerUrl.endsWith('.jpg') ||
    lowerUrl.endsWith('.jpeg') ||
    lowerUrl.endsWith('.png') ||
    lowerUrl.endsWith('.gif') ||
    lowerUrl.endsWith('.webp') ||
    lowerUrl.endsWith('.svg')
  ) {
    return true;
  }
  
  // Check if URL contains hints about being an image
  if (lowerUrl.includes('/image/') || lowerUrl.includes('image=')) {
    return true;
  }
  
  return false;
};

/**
 * Generates a thumbnail URL from a video URL
 * This is platform-specific and may not work for all video sources
 */
export const getThumbnailFromVideoUrl = (videoUrl: string): string | null => {
  if (!videoUrl) return null;
  
  const lowerUrl = videoUrl.toLowerCase();
  
  // YouTube thumbnail extraction
  if (lowerUrl.includes('youtube.com/watch') || lowerUrl.includes('youtu.be/')) {
    const videoId = lowerUrl.includes('youtube.com/watch') 
      ? new URL(videoUrl).searchParams.get('v')
      : videoUrl.split('/').pop();
      
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
  }
  
  // Vimeo thumbnail (would require API call in production)
  // Other platforms can be added here
  
  // For most direct video URLs, no thumbnail is available 
  // without server-side processing
  return null;
};

/**
 * Safely process URLs to ensure they're valid for use in img or video tags
 * @param url The URL to process
 * @returns A sanitized URL
 */
export const sanitizeMediaUrl = (url: string | undefined | null): string => {
  if (!url) return '';
  
  try {
    // Try to create a URL object to validate the URL
    new URL(url);
    return url;
  } catch (e) {
    // If it's not a valid URL but starts with a slash, it's likely a valid relative URL
    if (url.startsWith('/')) {
      return url;
    }
    
    // Otherwise, log the issue and return an empty string
    console.warn('Invalid URL:', url);
    return '';
  }
};

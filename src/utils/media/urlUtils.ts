/**
 * Check if URL is a video URL based on extension
 */
export const isVideoUrl = (url: string): boolean => {
  if (!url) return false;
  
  // Check for common video extensions
  const videoExtensionRegex = /\.(mp4|webm|mov|m4v|avi|wmv|flv|mkv|3gp)($|\?)/i;
  if (videoExtensionRegex.test(url)) return true;
  
  // Check for common video hosting patterns
  const videoHostingPatterns = [
    'youtube.com/watch',
    'youtu.be/',
    'vimeo.com/',
    '/videos/',
    '/video/',
    'dailymotion.com/',
    '.mp4',
    '.webm'
  ];
  
  return videoHostingPatterns.some(pattern => url.includes(pattern));
};

/**
 * Check if URL is an image URL based on extension
 */
export const isImageUrl = (url: string): boolean => {
  if (!url) return false;
  
  const imageExtensionRegex = /\.(jpe?g|png|gif|webp|avif|svg|bmp)($|\?)/i;
  return imageExtensionRegex.test(url);
};

/**
 * Clean a URL by removing cache busters and unnecessary parameters
 */
export const getCleanUrl = (url: string): string => {
  if (!url) return '';
  
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.delete('t');
    urlObj.searchParams.delete('cb');
    urlObj.searchParams.delete('cache');
    return urlObj.toString();
  } catch (e) {
    // If URL parsing fails, return the original URL
    return url;
  }
};

/**
 * Get a playable media URL with cache busting if needed
 */
export const getPlayableMediaUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  
  // Check if URL already has cache busting parameters
  const hasCacheBuster = url.includes('t=') || url.includes('cb=') || url.includes('cache=');
  
  // For direct blob URLs or data URLs, return as is
  if (url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  
  // Add cache buster if needed
  if (!hasCacheBuster && url.indexOf('?') === -1) {
    return `${url}?t=${Date.now()}`;
  } else if (!hasCacheBuster) {
    return `${url}&t=${Date.now()}`;
  }
  
  return url;
};

/**
 * Get file extension from URL
 */
export const getFileExtension = (url: string): string => {
  if (!url) return '';
  
  try {
    const pathname = new URL(url).pathname;
    const extension = pathname.split('.').pop() || '';
    return extension.toLowerCase();
  } catch (e) {
    // If URL parsing fails, try basic string manipulation
    const parts = url.split('.');
    if (parts.length > 1) {
      const ext = parts.pop() || '';
      // Remove query parameters if any
      return ext.split('?')[0].toLowerCase();
    }
    return '';
  }
};

/**
 * Convert relative URL to absolute URL
 */
export const toAbsoluteUrl = (url: string): string => {
  if (!url) return '';
  
  // If already absolute, return as is
  if (url.startsWith('http://') || url.startsWith('https://') || 
      url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  
  // If starts with /, assume it's relative to domain root
  if (url.startsWith('/')) {
    return `${window.location.origin}${url}`;
  }
  
  // Otherwise, assume it's relative to current path
  const basePath = window.location.pathname.split('/').slice(0, -1).join('/');
  return `${window.location.origin}${basePath}/${url}`;
};

/**
 * Generate a thumbnail URL from a video URL
 */
export const generateThumbnailUrl = (videoUrl: string): string => {
  // For some video services, we can construct thumbnail URLs
  if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
    const videoId = extractYoutubeId(videoUrl);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
  }
  
  // For Vimeo videos
  if (videoUrl.includes('vimeo.com')) {
    const videoId = extractVimeoId(videoUrl);
    if (videoId) {
      // Note: This is a placeholder. Actual Vimeo thumbnail URLs require API calls
      return `https://vumbnail.com/${videoId}.jpg`;
    }
  }
  
  // Default placeholder for other videos
  return '/assets/placeholders/video-placeholder.jpg';
};

/**
 * Extract YouTube video ID from URL
 */
const extractYoutubeId = (url: string): string | null => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

/**
 * Extract Vimeo video ID from URL
 */
const extractVimeoId = (url: string): string | null => {
  const regExp = /vimeo\.com\/(?:video\/|channels\/\w+\/|groups\/[^\/]+\/videos\/|album\/\d+\/video\/|)(\d+)(?:$|\/|\?)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

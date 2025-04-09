
/**
 * Adds cache busting parameters to a URL to prevent caching issues
 * @param baseUrl The original URL
 * @returns URL with cache busting parameters
 */
export const getUrlWithCacheBuster = (baseUrl: string | null): string => {
  if (!baseUrl) return '';
  const timestamp = Date.now();
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}cb=${timestamp}&r=${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Determines the content type based on available properties
 * @param story Story object
 * @returns Content type string ('video', 'image', or 'unknown')
 */
export const getContentType = (story: any): 'video' | 'image' | 'unknown' => {
  if (story.media_type) {
    return story.media_type as 'video' | 'image';
  }
  
  if (story.content_type) {
    return story.content_type as 'video' | 'image';
  }
  
  if (story.video_url) {
    return 'video';
  }
  
  if (story.media_url) {
    return 'image';
  }
  
  return 'unknown';
};

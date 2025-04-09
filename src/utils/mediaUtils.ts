
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
 * @param content Any content object with potential media properties
 * @returns Content type string ('video', 'image', or 'unknown')
 */
export const getContentType = (content: any): 'video' | 'image' | 'unknown' => {
  if (!content) return 'unknown';
  
  // First check explicit content type properties
  if (content.media_type) {
    return content.media_type as 'video' | 'image';
  }
  
  if (content.content_type) {
    return content.content_type as 'video' | 'image';
  }
  
  // Then look at URL properties
  if (content.video_url) {
    return 'video';
  }
  
  if (content.media_url) {
    return 'image';
  }
  
  // If we have arrays of URLs, check the first item
  if (Array.isArray(content.video_urls) && content.video_urls.length > 0) {
    return 'video';
  }
  
  if (Array.isArray(content.media_urls) && content.media_urls.length > 0) {
    return 'image';
  }
  
  return 'unknown';
};

/**
 * Generates a full Supabase storage URL from a path
 * @param bucket The storage bucket name
 * @param path The relative path within the bucket
 * @returns Full public URL
 */
export const getStorageUrl = (bucket: string, path: string | null): string => {
  if (!path) return '';
  
  // Extract project ID from environment or config
  const projectId = 'ysqbdaeohlupucdmivkt';
  return `https://${projectId}.supabase.co/storage/v1/object/public/${bucket}/${path}`;
};

/**
 * Gets the appropriate media URL based on content type
 * @param content Content object that may have various media properties
 * @returns The appropriate media URL or null if not found
 */
export const getMediaUrl = (content: any): string | null => {
  if (!content) return null;
  
  const mediaType = getContentType(content);
  
  if (mediaType === 'video') {
    return content.video_url || 
           (Array.isArray(content.video_urls) && content.video_urls.length > 0 ? content.video_urls[0] : null);
  }
  
  if (mediaType === 'image') {
    return content.media_url || 
           (Array.isArray(content.media_urls) && content.media_urls.length > 0 ? content.media_urls[0] : null);
  }
  
  return null;
};

/**
 * Creates a file path based on user ID with timestamp for uniqueness
 * @param userId User ID for file organization
 * @param fileName Original file name
 * @returns Structured file path
 */
export const createUniqueFilePath = (userId: string, fileName: string): string => {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 9);
  const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${userId}/${timestamp}_${randomId}_${safeFileName}`;
};

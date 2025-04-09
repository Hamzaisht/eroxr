
/**
 * Adds cache busting parameters to a URL to prevent caching issues
 * @param baseUrl The original URL
 * @returns URL with cache busting parameters
 */
export const getUrlWithCacheBuster = (baseUrl: string | null): string => {
  if (!baseUrl) return '';
  
  // Skip if URL already has cache busting
  if (baseUrl.includes('cb=') && baseUrl.includes('r=')) {
    return baseUrl;
  }
  
  // Add appropriate separator
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
    return content.media_type.toLowerCase() as 'video' | 'image';
  }
  
  if (content.content_type) {
    return content.content_type.toLowerCase() as 'video' | 'image';
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
  
  // If it's already a full URL, return it
  if (path.startsWith('http')) {
    return path;
  }
  
  // Extract project ID from environment or hardcode it
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
    // Handle video URLs
    if (content.video_url) {
      return content.video_url;
    } 
    
    if (Array.isArray(content.video_urls) && content.video_urls.length > 0) {
      return content.video_urls[0];
    }
    
    return null;
  }
  
  if (mediaType === 'image') {
    // Handle image URLs
    if (content.media_url) {
      return content.media_url;
    }
    
    if (Array.isArray(content.media_urls) && content.media_urls.length > 0) {
      return content.media_urls[0];
    }
    
    return null;
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

/**
 * Ensures a media URL is properly formatted and freshened with cache busting
 * @param url The media URL to format
 * @param bucket Optional bucket name if URL is just a path
 * @returns A properly formatted and cache-busted URL
 */
export const ensureProperMediaUrl = (url: string | null, bucket?: string): string => {
  if (!url) return '';
  
  // If it's just a path and bucket is provided, convert to full URL
  let fullUrl = url;
  if (bucket && !url.startsWith('http')) {
    fullUrl = getStorageUrl(bucket, url);
  }
  
  // Add cache busting
  return getUrlWithCacheBuster(fullUrl);
};

/**
 * Fixes a broken Supabase storage URL by reconstructing it properly
 * @param url The potentially broken URL
 * @returns A fixed URL or the original if it appears valid
 */
export const fixBrokenStorageUrl = (url: string | null): string => {
  if (!url) return '';
  
  // Check if URL is just a path without the domain
  if (!url.startsWith('http') && !url.includes('supabase.co')) {
    // Try to extract the bucket and path
    const parts = url.split('/');
    if (parts.length >= 2) {
      const bucket = parts[0];
      const path = parts.slice(1).join('/');
      return getStorageUrl(bucket, path);
    }
  }
  
  return url;
};

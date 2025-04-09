
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
export const getContentType = (content: any): 'video' | 'image' | 'unknown' => {
  if (content.media_type) {
    return content.media_type as 'video' | 'image';
  }
  
  if (content.content_type) {
    return content.content_type as 'video' | 'image';
  }
  
  if (content.video_url) {
    return 'video';
  }
  
  if (content.media_url) {
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
export const getStorageUrl = (bucket: string, path: string): string => {
  if (!path) return '';
  
  // Extract project ID from config.toml
  const projectId = 'ysqbdaeohlupucdmivkt';
  return `https://${projectId}.supabase.co/storage/v1/object/public/${bucket}/${path}`;
};

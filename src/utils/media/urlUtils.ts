
import { supabase } from "@/integrations/supabase/client";

/**
 * Get a clean version of a URL without query parameters
 */
export const getCleanUrl = (url: string): string => {
  if (!url) return '';
  return url.split('?')[0];
};

/**
 * Add cache busting parameter to URL, but only if not already present
 * Uses a simpler approach to avoid URL corruption
 */
export const addCacheBuster = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  
  // If URL already has a cache buster, don't add another one
  if (url.includes('v=') || url.includes('t=')) return url;
  
  const timestamp = Date.now();
  const separator = url.includes('?') ? '&' : '?';
  
  return `${url}${separator}v=${timestamp}`;
};

/**
 * Get displayable media URL with cache busting
 * This is the main function for getting URLs that will work in media components
 */
export const getDisplayableMediaUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  
  // If it's already a full URL (http, https, data, blob), just clean and return
  if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) {
    return addCacheBuster(getCleanUrl(url));
  }
  
  // If it's a storage path, get the public URL
  try {
    // Determine bucket from path
    let bucket = 'media';
    if (url.includes('/posts/')) bucket = 'posts';
    else if (url.includes('/stories/')) bucket = 'stories';
    else if (url.includes('/avatars/')) bucket = 'avatars';
    
    console.log(`Getting storage URL for path: ${url} in bucket: ${bucket}`);
    
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(url);
      
    return data?.publicUrl ? addCacheBuster(data.publicUrl) : '';
  } catch (error) {
    console.error('Failed to get storage URL:', error);
    return '';
  }
};

/**
 * Check if URL is accessible and get content type
 * Now with graceful fallback for CORS issues
 */
export const checkUrlContentType = async (url: string): Promise<{ 
  isValid: boolean;
  contentType: string | null;
  error?: string;
}> => {
  try {
    // For blob: and data: URLs, assume they're valid
    if (url.startsWith('blob:') || url.startsWith('data:')) {
      return { isValid: true, contentType: null };
    }
    
    // Perform a HEAD request to check validity
    const response = await fetch(url, { 
      method: 'HEAD',
      cache: 'no-store'
    });
    
    // Even if content-type is missing, consider URL valid if status is OK
    return {
      isValid: response.ok,
      contentType: response.headers.get('content-type')
    };
  } catch (error) {
    console.warn('URL check failed, but will continue anyway:', url);
    console.error(error);
    
    // Important: Return valid=true even if the check failed
    // This allows content to load despite CORS issues with HEAD requests
    return {
      isValid: true,  // Assume valid despite error
      contentType: null,
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

/**
 * Get media URL from Supabase storage
 */
export const getStorageUrl = async (path: string, bucket = 'media'): Promise<string | null> => {
  if (!path) return null;
  
  try {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
      
    return data?.publicUrl || null;
  } catch (error) {
    console.error('Failed to get storage URL:', error);
    return null;
  }
};

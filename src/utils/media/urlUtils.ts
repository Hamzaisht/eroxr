
import { supabase } from "@/integrations/supabase/client";

/**
 * Get a clean version of a URL without query parameters
 */
export const getCleanUrl = (url: string): string => {
  if (!url) return '';
  return url.split('?')[0];
};

/**
 * Add cache busting parameter to URL
 */
export const addCacheBuster = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const separator = url.includes('?') ? '&' : '?';
  
  return `${url}${separator}v=${timestamp}-${random}`;
};

/**
 * Get displayable media URL with cache busting
 * This is the main function for getting URLs that will work in media components
 */
export const getDisplayableMediaUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  return addCacheBuster(getCleanUrl(url));
};

/**
 * Check if URL is accessible and get content type
 */
export const checkUrlContentType = async (url: string): Promise<{ 
  isValid: boolean;
  contentType: string | null;
  error?: string;
}> => {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      cache: 'no-store'
    });
    
    return {
      isValid: response.ok,
      contentType: response.headers.get('content-type')
    };
  } catch (error) {
    return {
      isValid: false,
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

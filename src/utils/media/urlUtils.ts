
import { supabase } from "@/integrations/supabase/client";

/**
 * Get the playable media URL from a media object
 * @param media - Media object with potential URLs
 * @returns The full, playable URL
 */
export const getPlayableMediaUrl = (media: any): string => {
  if (!media) return '';
  
  // Handle direct string input
  if (typeof media === 'string') {
    return ensureFullUrl(media);
  }
  
  // Extract URL from object based on available properties
  const url = 
    media.video_url || 
    (Array.isArray(media.video_urls) && media.video_urls.length > 0 ? media.video_urls[0] : null) ||
    (typeof media.media_url === 'string' ? media.media_url : null) ||
    (Array.isArray(media.media_url) && media.media_url.length > 0 ? media.media_url[0] : null) ||
    media.url ||
    media.src ||
    '';
  
  return ensureFullUrl(url || '');
};

/**
 * Ensure the URL is a complete, usable URL
 * @param url - The URL to check and possibly modify
 * @returns A complete URL
 */
export const ensureFullUrl = (url: string): string => {
  if (!url) return '';
  
  // If already a complete URL or a data/blob URL, return as is
  if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  
  // If it starts with a slash, remove it
  const cleanPath = url.startsWith('/') ? url.substring(1) : url;
  
  // Determine the bucket from the path if possible
  let bucket = 'media';
  const possibleBuckets = ['stories', 'posts', 'videos', 'avatars', 'media', 'shorts'];
  
  for (const b of possibleBuckets) {
    if (cleanPath.startsWith(`${b}/`) || cleanPath.includes(`/${b}/`)) {
      bucket = b;
      break;
    }
  }
  
  // Get the public URL using Supabase
  try {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(cleanPath);
    
    return data?.publicUrl || '';
  } catch (error) {
    console.error(`Failed to get public URL for ${url}:`, error);
    return '';
  }
};

/**
 * Add cache busting parameter to URL
 */
export const addCacheBuster = (url: string): string => {
  if (!url) return '';
  
  // Prevent recursive cache busting by checking for existing timestamp
  if (url.includes('t=') && url.includes('&r=')) {
    return url;
  }
  
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  
  return url.includes('?') 
    ? `${url}&t=${timestamp}&r=${random}` 
    : `${url}?t=${timestamp}&r=${random}`;
};

/**
 * Get clean URL by removing query parameters
 */
export const getCleanUrl = (url: string): string => {
  if (!url) return '';
  return url.split('?')[0];
};

/**
 * Check if a URL is accessible
 */
export async function checkUrlAccessibility(url: string): Promise<{ 
  accessible: boolean; 
  contentType?: string;
  error?: string;
}> {
  try {
    // For blob: and data: URLs, assume they're valid
    if (url.startsWith('blob:') || url.startsWith('data:')) {
      return { accessible: true };
    }
    
    // Perform a HEAD request to check validity
    const response = await fetch(url, { 
      method: 'HEAD',
      cache: 'no-store'
    });
    
    return {
      accessible: response.ok,
      contentType: response.headers.get('content-type') || undefined
    };
  } catch (error) {
    console.warn('URL check failed, but will continue anyway:', url);
    // Return valid=true even if the check failed due to CORS issues
    return {
      accessible: true, 
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

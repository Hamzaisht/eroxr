
import { supabase } from "@/integrations/supabase/client";

/**
 * Generate a playable media URL from an item record.
 * This function handles several different data structures and returns a usable URL.
 */
export const getPlayableMediaUrl = (item: any): string | null => {
  // Handle null or undefined input
  if (!item) return null;

  // Handle array of URLs (return first valid one)
  if (item?.media_url && Array.isArray(item.media_url) && item.media_url.length > 0) {
    return item.media_url[0];
  }
  
  if (item?.media_urls && Array.isArray(item.media_urls) && item.media_urls.length > 0) {
    return item.media_urls[0];
  }
  
  if (item?.video_urls && Array.isArray(item.video_urls) && item.video_urls.length > 0) {
    return item.video_urls[0];
  }
  
  // Check for direct URL properties
  const videoUrl = item?.video_url;
  const mediaUrl = item?.media_url;
  const url = item?.url;
  
  // Return the first available URL
  return videoUrl || mediaUrl || url || null;
};

/**
 * Add cache busting parameters to a URL
 * Use sparingly to avoid excessive cache busting
 */
export const addCacheBuster = (url: string): string => {
  if (!url) return '';
  
  // If URL already has parameters, add to them
  const timestamp = Date.now();
  
  return url.includes('?') 
    ? `${url}&t=${timestamp}` 
    : `${url}?t=${timestamp}`;
};

/**
 * Check if a URL is accessible
 */
export const checkUrlAccessibility = async (url: string): Promise<boolean> => {
  if (!url) return false;
  
  try {
    // Use a HEAD request to check if resource exists
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'Cache-Control': 'no-cache',
      },
      cache: 'no-store',
    });
    
    return response.ok;
  } catch (error) {
    console.warn('URL accessibility check failed:', error);
    return false;
  }
};

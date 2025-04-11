
import { supabase } from "@/integrations/supabase/client";

/**
 * Adds a cache-busting parameter to prevent caching of media URLs
 */
export const addCacheBuster = (url: string | null): string | null => {
  if (!url) return null;
  
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return url.includes('?') 
    ? `${url}&t=${timestamp}&r=${random}` 
    : `${url}?t=${timestamp}&r=${random}`;
};

/**
 * Generate a playable media URL from an item record.
 * This function handles several different data structures and returns a usable URL.
 */
export const getPlayableMediaUrl = (item: any): string | null => {
  // Handle null or undefined input
  if (!item) return null;

  // Handle array of URLs (return first valid one)
  if (item?.media_url && Array.isArray(item.media_url) && item.media_url.length > 0) {
    return getFirstValidUrl(item.media_url);
  }
  
  if (item?.media_urls && Array.isArray(item.media_urls) && item.media_urls.length > 0) {
    return getFirstValidUrl(item.media_urls);
  }
  
  if (item?.video_urls && Array.isArray(item.video_urls) && item.video_urls.length > 0) {
    return getFirstValidUrl(item.video_urls);
  }
  
  // Check for direct URL properties
  const videoUrl = item?.video_url;
  const mediaUrl = item?.media_url;
  const url = item?.url;
  
  // Return the first available URL
  const firstValidUrl = videoUrl || mediaUrl || url;
  
  if (!firstValidUrl) return null;
  
  // If it's already a full URL, return it
  if (typeof firstValidUrl === 'string' && firstValidUrl.startsWith('http')) {
    return firstValidUrl;
  }
  
  // If it's a storage path, get the public URL
  return getStoragePublicUrl(firstValidUrl);
};

/**
 * Gets the first valid URL from an array of URLs
 */
const getFirstValidUrl = (urls: string[]): string | null => {
  if (!urls || !Array.isArray(urls) || urls.length === 0) return null;
  
  // Find first non-empty URL
  const firstUrl = urls.find(url => !!url);
  if (!firstUrl) return null;
  
  // If it's already a full URL, return it
  if (firstUrl.startsWith('http')) return firstUrl;
  
  // Get the public URL from Supabase storage
  return getStoragePublicUrl(firstUrl);
};

/**
 * Converts a storage path to a public URL
 */
const getStoragePublicUrl = (path: string): string | null => {
  if (!path) return null;
  
  // Determine bucket from path if possible
  let bucket = 'media';
  const possibleBuckets = ['stories', 'posts', 'videos', 'avatars', 'banners', 'media'];
  
  for (const b of possibleBuckets) {
    if (path.startsWith(`${b}/`) || path.includes(`/${b}/`)) {
      bucket = b;
      break;
    }
  }
  
  // Make sure we have a clean path that doesn't include the bucket name at the start
  let cleanPath = path;
  if (cleanPath.startsWith(`${bucket}/`)) {
    cleanPath = cleanPath.substring(bucket.length + 1);
  }
  
  // Get the public URL from Supabase
  const { data } = supabase.storage.from(bucket).getPublicUrl(cleanPath);
  
  return data.publicUrl || null;
};

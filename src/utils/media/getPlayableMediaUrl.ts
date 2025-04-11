
import { supabase } from "@/integrations/supabase/client";

/**
 * Adds a cache-busting parameter to prevent caching of media URLs
 */
export const addCacheBuster = (url: string | null): string | null => {
  if (!url) return null;
  
  // First, clean up any existing cache busters to avoid chaining too many
  let cleanUrl = url;
  try {
    const urlObj = new URL(url);
    // Remove any existing t= and r= parameters
    if (urlObj.searchParams.has('t')) urlObj.searchParams.delete('t');
    if (urlObj.searchParams.has('r')) urlObj.searchParams.delete('r');
    cleanUrl = urlObj.toString();
  } catch (e) {
    // If URL parsing fails, proceed with original URL
    console.warn("Could not parse URL for cleaning:", url);
  }
  
  // Generate unique timestamp and random string for effective cache busting
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  
  // Append cache busters to the URL
  return cleanUrl.includes('?') 
    ? `${cleanUrl}&t=${timestamp}&r=${random}` 
    : `${cleanUrl}?t=${timestamp}&r=${random}`;
};

/**
 * Generate a playable media URL from an item record.
 * This function handles several different data structures and returns a usable URL.
 */
export const getPlayableMediaUrl = (item: any): string | null => {
  // Handle null or undefined input
  if (!item) return null;

  // Debug info to help identify issues
  console.debug("Getting playable URL for:", item);

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
  
  if (!firstValidUrl) {
    console.debug("No valid media URL found in item:", item);
    return null;
  }
  
  // If it's already a full URL, return it
  if (typeof firstValidUrl === 'string') {
    if (firstValidUrl.startsWith('http') || firstValidUrl.startsWith('/api/')) {
      return firstValidUrl;
    }
    
    // If it's a storage path, get the public URL
    return getStoragePublicUrl(firstValidUrl);
  }
  
  // If we got here and firstValidUrl is not a string, log and return null
  console.warn("Invalid URL type:", typeof firstValidUrl, firstValidUrl);
  return null;
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
  if (firstUrl.startsWith('http') || firstUrl.startsWith('/api/')) return firstUrl;
  
  // Get the public URL from Supabase storage
  return getStoragePublicUrl(firstUrl);
};

/**
 * Converts a storage path to a public URL
 */
const getStoragePublicUrl = (path: string): string | null => {
  if (!path) return null;
  
  // Ensure the path doesn't start with /
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // Determine bucket from path if possible
  let bucket = 'media';
  const possibleBuckets = ['stories', 'posts', 'videos', 'avatars', 'banners', 'media', 'shorts'];
  
  for (const b of possibleBuckets) {
    if (cleanPath.startsWith(`${b}/`) || cleanPath.includes(`/${b}/`)) {
      bucket = b;
      break;
    }
  }
  
  // Make sure we have a clean path that doesn't include the bucket name at the start
  let finalPath = cleanPath;
  if (finalPath.startsWith(`${bucket}/`)) {
    finalPath = finalPath.substring(bucket.length + 1);
  }
  
  try {
    // Get the public URL from Supabase
    const { data } = supabase.storage.from(bucket).getPublicUrl(finalPath);
    console.debug(`Resolved ${path} to ${data.publicUrl} (bucket: ${bucket}, path: ${finalPath})`);
    
    return data.publicUrl || null;
  } catch (e) {
    console.error(`Failed to get public URL for ${path} in bucket ${bucket}:`, e);
    return null;
  }
};

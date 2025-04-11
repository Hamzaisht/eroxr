
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
  
  // If it's already a full URL, ensure CORS headers are respected
  if (typeof firstValidUrl === 'string') {
    if (firstValidUrl.startsWith('http') || firstValidUrl.startsWith('/api/')) {
      // For external URLs, we need to ensure CORS is handled
      // If the URL is from our Supabase storage, we're good
      if (firstValidUrl.includes('supabase.co/storage')) {
        return firstValidUrl;
      }
      
      // For other external URLs, we might need a proxy in some cases
      // But for now, return the URL directly and monitor for CORS issues
      return firstValidUrl;
    }
    
    // If it's a storage path, get the public URL with proper auth headers
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
    // Get the public URL from Supabase with authentication if needed
    const { data } = supabase.storage.from(bucket).getPublicUrl(finalPath);
    console.debug(`Resolved ${path} to ${data.publicUrl} (bucket: ${bucket}, path: ${finalPath})`);
    
    // Check for auth session and add token for protected resources if needed
    const checkForAuthToken = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData && sessionData.session && bucket !== 'avatars' && bucket !== 'banners' && bucket !== 'media') {
          // For protected buckets, append auth token
          const token = sessionData.session.access_token;
          if (token) {
            const url = new URL(data.publicUrl);
            url.searchParams.append('token', token);
            return url.toString();
          }
        }
      } catch (error) {
        console.warn("Error getting auth session:", error);
      }
      return data.publicUrl;
    };
    
    // Since we're in a synchronous function but need async functionality,
    // we'll return the public URL immediately and let the auth check happen separately if needed
    // This is a compromise - for fully authenticated URLs, consider using an async approach
    
    return data.publicUrl || null;
  } catch (e) {
    console.error(`Failed to get public URL for ${path} in bucket ${bucket}:`, e);
    return null;
  }
};

/**
 * Checks if a URL is accessible and returns a promise
 * that resolves with true if accessible, false otherwise
 */
export const checkUrlAccessibility = async (url: string): Promise<boolean> => {
  if (!url) return false;
  
  try {
    // Use HEAD request to check if URL is accessible without downloading content
    const response = await fetch(url, { 
      method: 'HEAD',
      mode: 'cors',
      credentials: 'omit' // Don't send cookies for cross-origin requests
    });
    
    return response.ok;
  } catch (error) {
    console.error(`URL accessibility check failed for ${url}:`, error);
    return false;
  }
};

/**
 * Gets the CORS-friendly version of a URL
 * This can be used for problematic URLs that need proxy handling
 */
export const getCorsProxyUrl = (url: string): string => {
  if (!url) return url;
  
  // If it's a Supabase URL, it should already handle CORS
  if (url.includes('supabase.co')) {
    return url;
  }
  
  // For external URLs that might have CORS issues, we could use a proxy
  // This is a placeholder - in a real app, you might implement a proxy service
  // or use an existing CORS proxy service
  
  // For now, return the original URL and handle failures via the error handling system
  return url;
};


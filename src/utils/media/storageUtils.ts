
import { supabase } from "@/integrations/supabase/client";

/**
 * Gets the first valid URL from an array of URLs
 */
export const getFirstValidUrl = (urls: string[]): string | null => {
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
export const getStoragePublicUrl = (path: string): string | null => {
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
    // First try to get a public URL
    const publicUrlData = supabase.storage.from(bucket).getPublicUrl(finalPath);
    const publicUrl = publicUrlData.data.publicUrl;
    
    // Try to generate a signed URL asynchronously as they're more reliable
    // but don't wait for it since we need to return something synchronously
    try {
      // Don't use await here - we want to return something synchronously
      supabase.storage
        .from(bucket)
        .createSignedUrl(finalPath, 60 * 60) // 1 hour expiry
        .then(({ data, error }) => {
          if (data?.signedUrl && !error) {
            console.debug(`Generated signed URL for ${path}: ${data.signedUrl}`);
            // We can't update the return value here since we already returned publicUrl
          }
        })
        .catch(signError => {
          console.warn(`Failed to get signed URL for ${path}:`, signError);
        });
    } catch (signError) {
      console.warn(`Failed to get signed URL for ${path}:`, signError);
    }
    
    console.debug(`Resolved ${path} to ${publicUrl}`);
    return publicUrl;
  } catch (e) {
    console.error(`Failed to get public URL for ${path} in bucket ${bucket}:`, e);
    return null;
  }
};

/**
 * Gets an authenticated URL for protected resources
 * Use this for resources that require authentication
 */
export const getAuthenticatedUrl = async (path: string): Promise<string | null> => {
  if (!path) return null;
  
  // Clean the path and determine bucket
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
  
  // Clean up path to remove bucket prefix
  let finalPath = cleanPath;
  if (finalPath.startsWith(`${bucket}/`)) {
    finalPath = finalPath.substring(bucket.length + 1);
  }
  
  try {
    // First try to get a signed URL for better access
    try {
      // Use await here since this function is already async
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(finalPath, 60 * 60); // 1 hour expiry
        
      if (data?.signedUrl && !error) {
        console.debug(`Generated signed URL for protected resource ${path}: ${data.signedUrl}`);
        return data.signedUrl;
      }
    } catch (signError) {
      console.warn(`Failed to get signed URL for ${path}:`, signError);
      // Fall back to public URL approach
    }
    
    // Get the public URL with timestamp to avoid caching
    const { data } = supabase.storage.from(bucket).getPublicUrl(finalPath);
    const publicUrl = data.publicUrl;
    
    // Add timestamp to URL to prevent caching
    const timestamp = Date.now();
    const url = publicUrl.includes('?') ? 
      `${publicUrl}&t=${timestamp}` : 
      `${publicUrl}?t=${timestamp}`;
    
    console.debug(`Generated URL for ${path}: ${url}`);
    return url;
  } catch (e) {
    console.error(`Failed to get URL for ${path}:`, e);
    return null;
  }
};

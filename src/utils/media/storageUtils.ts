
import { supabase } from "@/integrations/supabase/client";

/**
 * Gets the first valid URL from an array of URLs
 */
export const getFirstValidUrl = (urls: string[]): string | null => {
  if (!urls || !Array.isArray(urls) || urls.length === 0) return null;
  
  // Find first non-empty URL
  return urls.find(url => !!url) || null;
};

/**
 * Converts a storage path to a public URL
 */
export const getStoragePublicUrl = (path: string): string | null => {
  if (!path) return null;
  
  // If it's already a full URL, return it
  if (path.startsWith('http')) return path;

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
    // Get a public URL - direct approach
    const { data } = supabase.storage.from(bucket).getPublicUrl(finalPath);
    
    // Return the URL immediately for synchronous use
    return data.publicUrl;
  } catch (e) {
    console.error(`Failed to get public URL for ${path} in bucket ${bucket}:`, e);
    return null;
  }
};

/**
 * Gets an authenticated URL for protected resources
 */
export const getAuthenticatedUrl = async (path: string): Promise<string | null> => {
  if (!path) return null;
  
  // If it's already a full URL, return it
  if (path.startsWith('http')) return path;
  
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
    // Try to get a signed URL for better access
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(finalPath, 60 * 60); // 1 hour expiry
      
    if (data?.signedUrl && !error) {
      return data.signedUrl;
    }
    
    // Fall back to public URL
    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(finalPath);
    return publicUrlData.publicUrl;
  } catch (e) {
    console.error(`Failed to get URL for ${path}:`, e);
    return null;
  }
};


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
 * Handles various formats of storage paths
 */
export const getStoragePublicUrl = (path: string): string | null => {
  if (!path) return null;
  
  // If it's already a full URL, return it
  if (path.startsWith('http')) return path;

  // If it's a blob or data URL, return as is
  if (path.startsWith('blob:') || path.startsWith('data:')) return path;

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
    
    console.log(`Generated storage URL for bucket ${bucket}, path ${finalPath}:`, data?.publicUrl);
    
    // Return the URL immediately for synchronous use
    return data?.publicUrl ?? null;
  } catch (e) {
    console.error(`Failed to get public URL for ${path} in bucket ${bucket}:`, e);
    
    // Try all buckets as a last resort
    for (const fallbackBucket of possibleBuckets) {
      if (fallbackBucket === bucket) continue; // Skip the one we already tried
      
      try {
        const { data } = supabase.storage.from(fallbackBucket).getPublicUrl(cleanPath);
        if (data?.publicUrl) {
          console.log(`Found URL in fallback bucket ${fallbackBucket}:`, data.publicUrl);
          return data.publicUrl;
        }
      } catch (fallbackError) {
        // Ignore fallback errors
      }
    }
    
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
  
  // If it's a blob or data URL, return as is
  if (path.startsWith('blob:') || path.startsWith('data:')) return path;
  
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
      console.log(`Created signed URL for ${bucket}/${finalPath}:`, data.signedUrl);
      return data.signedUrl;
    }
    
    // Fall back to public URL
    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(finalPath);
    console.log(`Falling back to public URL for ${bucket}/${finalPath}:`, publicUrlData?.publicUrl);
    return publicUrlData?.publicUrl ?? null;
  } catch (e) {
    console.error(`Failed to get URL for ${path}:`, e);
    
    // Try all buckets as a last resort
    for (const fallbackBucket of possibleBuckets) {
      if (fallbackBucket === bucket) continue; // Skip the one we already tried
      
      try {
        const { data } = supabase.storage.from(fallbackBucket).getPublicUrl(cleanPath);
        if (data?.publicUrl) {
          console.log(`Found URL in fallback bucket ${fallbackBucket}:`, data.publicUrl);
          return data.publicUrl;
        }
      } catch (fallbackError) {
        // Ignore fallback errors
      }
    }
    
    return null;
  }
};

/**
 * Check if a storage bucket exists
 */
export const checkBucketExists = async (bucketName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage.getBucket(bucketName);
    return !error && !!data;
  } catch (e) {
    console.error(`Error checking bucket ${bucketName}:`, e);
    return false;
  }
};

/**
 * Create a storage bucket if it doesn't exist
 */
export const ensureBucketExists = async (
  bucketName: string, 
  isPublic = true
): Promise<boolean> => {
  try {
    // First check if bucket exists
    const exists = await checkBucketExists(bucketName);
    
    if (exists) {
      console.log(`Bucket ${bucketName} already exists`);
      return true;
    }
    
    // Create bucket if it doesn't exist
    const { error } = await supabase.storage.createBucket({
      name: bucketName,
      public: isPublic,
      fileSizeLimit: 100 * 1024 * 1024 // 100MB
    });
    
    if (error) {
      console.error(`Failed to create bucket ${bucketName}:`, error);
      return false;
    }
    
    console.log(`Successfully created bucket ${bucketName}`);
    return true;
  } catch (e) {
    console.error(`Error ensuring bucket ${bucketName} exists:`, e);
    return false;
  }
};

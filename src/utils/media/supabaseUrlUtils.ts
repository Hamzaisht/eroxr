
import { supabase } from "@/integrations/supabase/client";

/**
 * Configuration for URL generation
 */
export interface UrlOptions {
  /**
   * Whether to use signed URLs (for private buckets)
   * Set to false for public buckets
   */
  useSignedUrls?: boolean;
  
  /**
   * Expiration time for signed URLs in seconds
   * Default is 1 hour (3600 seconds)
   */
  expiresIn?: number;
  
  /**
   * Whether to add cache busting
   */
  cacheBust?: boolean;
}

/**
 * Default options for URL generation
 */
const DEFAULT_OPTIONS: UrlOptions = {
  useSignedUrls: true, // Default to using signed URLs for security
  expiresIn: 3600, // Default expiration: 1 hour
  cacheBust: true, // Add cache busting by default
};

/**
 * Gets a URL for a file in Supabase storage
 * Works with both public and private buckets
 * 
 * @param bucket The storage bucket name
 * @param path The file path within the bucket
 * @param options Options for URL generation
 * @returns Promise with the URL or error
 */
export const getSupabaseUrl = async (
  bucket: string,
  path: string,
  options?: Partial<UrlOptions>
): Promise<{ url: string | null; error?: string }> => {
  try {
    if (!path) {
      return { url: null, error: "No file path provided" };
    }

    // Merge default options with provided options
    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
    const { useSignedUrls, expiresIn, cacheBust } = mergedOptions;

    // Use signed URLs for private buckets
    if (useSignedUrls) {
      console.log(`Getting signed URL for ${bucket}/${path}`);
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn || 3600);
        
      if (error) {
        console.error("Error getting signed URL:", error);
        // Fallback to public URL if signed URL fails
        const { data: publicUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(path);
          
        return { 
          url: publicUrlData.publicUrl,
          error: `Signed URL failed, falling back to public: ${error.message}`
        };
      }
      
      const signedUrl = data?.signedUrl;
      
      if (!signedUrl) {
        return { url: null, error: "Failed to generate signed URL" };
      }
      
      // Add cache busting if needed
      const finalUrl = cacheBust 
        ? addCacheBuster(signedUrl) 
        : signedUrl;
        
      return { url: finalUrl };
    } else {
      // Use public URL for public buckets
      console.log(`Getting public URL for ${bucket}/${path}`);
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);
      
      // Add cache busting if needed
      const publicUrl = data.publicUrl;
      const finalUrl = cacheBust 
        ? addCacheBuster(publicUrl) 
        : publicUrl;
        
      return { url: finalUrl };
    }
  } catch (error: any) {
    console.error("Error getting Supabase URL:", error);
    return { 
      url: null, 
      error: error.message || "An unknown error occurred"
    };
  }
};

/**
 * Add a cache buster to a URL
 * 
 * @param url The URL to add cache busting to
 * @returns The URL with cache busting
 */
export const addCacheBuster = (url: string): string => {
  if (!url) return url;
  
  // Check if URL already has parameters
  const separator = url.includes('?') ? '&' : '?';
  
  // Add timestamp as cache buster
  return `${url}${separator}t=${Date.now()}`;
};

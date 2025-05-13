
import { supabase } from '@/integrations/supabase/client';

interface SupabaseUrlOptions {
  useSignedUrls?: boolean;
  expiresIn?: number; // Seconds
}

interface SupabaseUrlResult {
  url: string;
  error?: string;
}

/**
 * Get a URL for a file in Supabase storage
 * This utility handles both public and signed URLs
 */
export const getSupabaseUrl = async (
  bucket: string,
  path: string,
  options?: SupabaseUrlOptions
): Promise<SupabaseUrlResult> => {
  if (!path) {
    return {
      url: '',
      error: 'No file path provided'
    };
  }
  
  try {
    // Default to public URLs unless signed URLs are explicitly requested
    const useSignedUrls = options?.useSignedUrls || false;
    
    if (useSignedUrls) {
      const expiresIn = options?.expiresIn || 3600; // Default 1 hour
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);
      
      if (error) {
        throw error;
      }
      
      return {
        url: data.signedUrl
      };
    } else {
      // Get public URL
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);
      
      return {
        url: data.publicUrl
      };
    }
  } catch (error: any) {
    console.error(`Error getting Supabase URL for ${bucket}/${path}:`, error);
    
    return {
      url: '',
      error: error.message || 'Failed to generate URL'
    };
  }
};

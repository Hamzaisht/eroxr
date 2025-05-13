
import { supabase } from "@/integrations/supabase/client";

interface UrlOptions {
  useSignedUrls?: boolean;
  expiresIn?: number;
}

/**
 * Gets a proper URL for Supabase storage content
 * Handles both signed URLs (for private buckets) and public URLs
 */
export async function getSupabaseUrl(bucket: string, path: string, options: UrlOptions = {}): Promise<{
  url: string;
  success: boolean;
  error?: string;
}> {
  try {
    if (options.useSignedUrls) {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, options.expiresIn || 3600);
        
      if (error || !data?.signedUrl) {
        throw error || new Error('No signed URL returned');
      }
      
      return {
        url: data.signedUrl,
        success: true
      };
    } else {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);
      
      if (!data?.publicUrl) {
        throw new Error('No public URL returned');
      }
      
      return {
        url: data.publicUrl,
        success: true
      };
    }
  } catch (error: any) {
    console.error('Error getting storage URL:', error);
    return {
      url: '',
      success: false,
      error: error.message || 'Failed to get URL'
    };
  }
}

/**
 * Add cache buster to URL to prevent caching issues
 */
export function addCacheBuster(url: string): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_cb=${Date.now()}`;
}

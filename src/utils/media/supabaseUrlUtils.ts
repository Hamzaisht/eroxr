
import { supabase } from '@/integrations/supabase/client';

interface SupabaseUrlOptions {
  useSignedUrls?: boolean;
  download?: boolean;
  transform?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'png' | 'jpg' | 'jpeg' | 'origin';
  };
}

/**
 * Get a URL for a file in Supabase storage
 * This function can return either a public or signed URL based on options
 */
export const getSupabaseUrl = async (
  bucket: string, 
  path: string, 
  options: SupabaseUrlOptions = {}
): Promise<{ url: string; error?: string }> => {
  if (!path) {
    return { url: '', error: 'No path provided' };
  }
  
  try {
    if (options.useSignedUrls) {
      // Get signed URL (for private buckets)
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, 3600);
      
      if (error) {
        console.error('Error getting signed URL:', error);
        return { url: '', error: error.message };
      }
      
      return { url: data?.signedUrl || '' };
    } else {
      // Get public URL
      const { data } = supabase.storage.from(bucket).getPublicUrl(path, {
        download: options.download,
        transform: options.transform
      });
      
      return { url: data?.publicUrl || '' };
    }
  } catch (error: any) {
    console.error('Error getting URL:', error);
    return { url: '', error: error.message };
  }
};

import { supabase } from '@/integrations/supabase/client';

interface SupabaseUrlOptions {
  useSignedUrls?: boolean;
  expiresIn?: number;
}

/**
 * Gets a URL for a file in Supabase storage
 * @param bucket - The storage bucket name
 * @param path - The file path within the bucket
 * @param options - Options for URL generation
 * @returns The URL and any error
 */
export async function getSupabaseUrl(
  bucket: string, 
  path: string, 
  options: SupabaseUrlOptions = {}
): Promise<{ url: string, error: string | null }> {
  try {
    if (!path) {
      return { url: '', error: 'No path provided' };
    }

    // Use signed URL if requested (for private buckets)
    if (options.useSignedUrls) {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, options.expiresIn || 60 * 60); // Default 1 hour
      
      if (error) {
        return { url: '', error: error.message };
      }
      
      return { url: data?.signedUrl || '', error: null };
    } 
    
    // Otherwise use public URL
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return { url: data?.publicUrl || '', error: null };
  } catch (error: any) {
    console.error("Error getting Supabase URL:", error);
    return { url: '', error: error.message || 'Failed to get URL' };
  }
}

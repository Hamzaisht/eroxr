
import { supabase } from "@/integrations/supabase/client";

interface UrlOptions {
  useSignedUrls?: boolean;
  download?: boolean;
  transform?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png';
  };
}

interface SupabaseUrlResult {
  url: string | null;
  error?: string;
}

/**
 * Get a URL for a file in Supabase storage
 * This handles both public and signed URLs
 */
export async function getSupabaseUrl(
  bucket: string,
  filePath: string,
  options: UrlOptions = {}
): Promise<SupabaseUrlResult> {
  try {
    if (!bucket || !filePath) {
      return { 
        url: null, 
        error: 'Missing bucket or file path' 
      };
    }
    
    // Default to public URLs
    const { useSignedUrls = false } = options;
    
    if (!useSignedUrls) {
      // Get public URL (works for public buckets)
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath, {
          download: options.download,
          transform: options.transform
        });
        
      if (!data.publicUrl) {
        console.warn(`Failed to get public URL for ${bucket}/${filePath}`);
        return { 
          url: null, 
          error: 'Could not get public URL' 
        };
      }
      
      return { url: data.publicUrl };
    } else {
      // Get signed URL (works for private buckets or when authentication is needed)
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, 60 * 60); // 1 hour expiry
      
      if (error || !data?.signedUrl) {
        console.error(`Failed to get signed URL for ${bucket}/${filePath}:`, error);
        
        // Fallback to public URL if signed URL fails
        const { data: publicData } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);
          
        if (publicData.publicUrl) {
          console.log(`Falling back to public URL for ${bucket}/${filePath}`);
          return { url: publicData.publicUrl };
        }
        
        return { 
          url: null, 
          error: error?.message || 'Could not create signed URL' 
        };
      }
      
      return { url: data.signedUrl };
    }
  } catch (err: any) {
    console.error(`Error getting Supabase URL for ${bucket}/${filePath}:`, err);
    return {
      url: null,
      error: err.message || 'Unknown error getting URL'
    };
  }
}

/**
 * Check if a file exists in Supabase storage
 */
export async function checkFileExists(
  bucket: string,
  filePath: string
): Promise<boolean> {
  try {
    // List files with exact match of path
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(filePath.split('/').slice(0, -1).join('/'), {
        limit: 1,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      });
    
    if (error || !data) {
      return false;
    }
    
    const fileName = filePath.split('/').pop();
    return data.some(file => file.name === fileName);
  } catch {
    return false;
  }
}

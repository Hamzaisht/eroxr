
import { supabase } from "@/integrations/supabase/client";

/**
 * Get the Supabase URL for a project
 */
export function getSupabaseUrl(): string {
  // Extract from the current client
  const url = supabase.supabaseUrl;
  return url;
}

/**
 * Get a public URL for a file in a bucket
 */
export function getPublicStorageUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Get a signed URL for a file in a bucket (for private files)
 */
export async function getSignedUrl(bucket: string, path: string, expiresIn = 60): Promise<string | null> {
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
  
  if (error) {
    console.error('Error creating signed URL:', error);
    return null;
  }
  
  return data.signedUrl;
}

/**
 * Transform a path into a full Supabase storage URL
 */
export function getFullStorageUrl(bucket: string, path: string): string {
  if (!path) return '';
  
  const baseUrl = getSupabaseUrl();
  return `${baseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

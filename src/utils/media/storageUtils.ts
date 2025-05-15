
import { supabase } from "@/integrations/supabase/client";
import { getSupabaseUrl } from "./supabaseUrlUtils";

/**
 * Gets a public URL for a file in Supabase storage
 */
export async function getPublicStorageUrl(
  bucket: string,
  path: string
): Promise<string> {
  if (!path) return '';
  
  // Use our utility function for getting URLs
  const result = await getSupabaseUrl(bucket, path, { useSignedUrls: false });
  
  if (result.error) {
    console.error("Error getting public URL:", result.error);
  }
  
  return result.url || '';
}

/**
 * List files in a storage bucket
 */
export async function listBucketFiles(
  bucket: string,
  path?: string
): Promise<{ paths: string[]; error?: string }> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path || '');
    
    if (error) {
      return { paths: [], error: error.message };
    }
    
    const filePaths = data
      .filter(item => !item.id.endsWith('/')) // Filter out folders
      .map(item => item.name);
    
    return { paths: filePaths };
  } catch (error: any) {
    return { paths: [], error: error.message };
  }
}

/**
 * Delete a file from storage
 */
export async function deleteFile(
  bucket: string,
  path: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

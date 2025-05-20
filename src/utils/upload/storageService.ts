
import { supabase } from '@/integrations/supabase/client';

/**
 * Uploads a file to Supabase storage
 */
export const uploadFileToStorage = async (
  bucket: string, 
  filePath: string, 
  file: File | string
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // Handle string file input (data URL)
    let fileToUpload: File | Blob = file as File;
    
    // Convert data URL to blob if needed
    if (typeof file === 'string' && file.startsWith('data:')) {
      const res = await fetch(file);
      fileToUpload = await res.blob();
    } else if (typeof file !== 'object') {
      return { success: false, error: 'Invalid file format' };
    }
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileToUpload, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      return { success: false, error: error.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { success: true, url: publicUrlData.publicUrl };
  } catch (error: any) {
    console.error('Unexpected upload error:', error);
    return { success: false, error: error.message || 'Unknown upload error' };
  }
};

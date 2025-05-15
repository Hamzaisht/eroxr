
import { supabase } from '@/integrations/supabase/client';

/**
 * Uploads a file to Supabase storage
 * @param bucket The storage bucket name
 * @param path The file path within the bucket
 * @param file The file to upload
 * @returns Object with success status, path and errors
 */
export const uploadFileToStorage = async (
  bucket: string,
  path: string,
  file: File
): Promise<{
  success: boolean;
  path?: string;
  url?: string;
  error?: string;
}> => {
  try {
    // Validate the file
    if (!(file instanceof File)) {
      return {
        success: false,
        error: 'Invalid file object',
      };
    }

    // Upload with explicit content type and upsert: true
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return {
        success: false,
        error: uploadError.message,
      };
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(uploadData?.path || path);

    return {
      success: true,
      path: uploadData?.path || path,
      url: publicUrlData?.publicUrl,
    };
  } catch (error: any) {
    console.error('Storage upload error:', error);
    return {
      success: false,
      error: error.message || 'Unknown upload error',
    };
  }
};


import { supabase } from '@/integrations/supabase/client';
import { UploadOptions, UploadResult, MediaAccessLevel } from './types';
import { createUniqueFilePath } from './mediaUtils';

/**
 * Upload media to Supabase storage
 * @param file File to upload
 * @param bucket Bucket name
 * @param options Upload options
 * @returns Promise<UploadResult>
 */
export async function uploadMediaToSupabase(
  file: File,
  bucket: string = 'media',
  options: UploadOptions = {}
): Promise<UploadResult> {
  try {
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    const {
      path,
      contentType = file.type,
      maxSizeMB = 100,
      folder = '',
      accessLevel = MediaAccessLevel.PUBLIC,
      contentCategory
    } = options;

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return { 
        success: false, 
        error: `File exceeds maximum size of ${maxSizeMB}MB` 
      };
    }

    // Generate a unique path if not provided
    const filePath = path || createUniqueFilePath(file, { folder });
    console.log(`Uploading to ${bucket}/${filePath}`);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        contentType,
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: error.message };
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      success: true,
      url: publicUrl,
      publicUrl,
      path: data.path,
      accessLevel,
      contentCategory
    };
  } catch (err: any) {
    console.error('Upload failed:', err);
    return { 
      success: false, 
      error: err.message || 'Unknown error during upload' 
    };
  }
}

/**
 * Delete media from Supabase storage
 * @param path Path to file
 * @param bucket Bucket name
 * @returns Promise<boolean>
 */
export async function deleteMediaFromSupabase(
  path: string,
  bucket: string = 'media'
): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Delete failed:', err);
    return false;
  }
}

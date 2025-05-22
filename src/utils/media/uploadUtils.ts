
import { supabase } from '@/integrations/supabase/client';
import { UploadOptions, UploadResult, MediaAccessLevel } from './types';
import { createUniqueFilePath } from './fileUtils';
import { addCacheBuster } from './urlUtils';

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
      console.error("No file provided to uploadMediaToSupabase");
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
      console.error(`File size exceeds maximum: ${file.size} > ${maxSizeBytes}`);
      return { 
        success: false, 
        error: `File exceeds maximum size of ${maxSizeMB}MB` 
      };
    }

    // Generate a unique path if not provided
    const filePath = path || createUniqueFilePath(file, { folder });
    console.log(`Uploading to ${bucket}/${filePath} (${contentType})`);

    // Upload to Supabase Storage with explicit content type
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

    if (!data || !data.path) {
      console.error('Upload succeeded but no path returned');
      return { success: false, error: 'Upload succeeded but no path returned' };
    }

    // Get the public URL - CRITICAL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    if (!publicUrl) {
      console.error('Failed to generate public URL');
      return { success: false, error: 'Failed to generate public URL' };
    }

    // Add cache buster to ensure the URL is unique
    const finalUrl = addCacheBuster(publicUrl);
    console.log('Upload successful. Public URL:', finalUrl);

    return {
      success: true,
      url: finalUrl,
      publicUrl: finalUrl,
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


import { UploadOptions, UploadResult, MediaAccessLevel } from '@/types/media';
import { supabase } from '@/integrations/supabase/client';
import { createUniqueFilePath } from './fileUtils';

/**
 * Default upload options
 */
export const defaultUploadOptions: UploadOptions = {
  maxSizeMB: 50,
  accessLevel: MediaAccessLevel.PUBLIC,
  bucket: 'media'
};

/**
 * Validates upload options
 */
export const validateUploadOptions = (options: UploadOptions): boolean => {
  if (options.maxSizeMB && options.maxSizeMB <= 0) {
    return false;
  }
  
  return true;
};

/**
 * Creates a successful upload result
 */
export const createSuccessResult = (url: string): UploadResult => {
  return {
    success: true,
    url
  };
};

/**
 * Creates a failed upload result
 */
export const createErrorResult = (error: string): UploadResult => {
  return {
    success: false,
    error
  };
};

/**
 * Main upload function that uploads media to Supabase storage
 */
export const uploadMediaToSupabase = async (
  file: File,
  bucket: string,
  options: UploadOptions = {}
): Promise<UploadResult> => {
  try {
    // Merge with default options
    const uploadOptions = { ...defaultUploadOptions, ...options };
    
    // Validate options
    if (!validateUploadOptions(uploadOptions)) {
      return createErrorResult('Invalid upload options');
    }
    
    // Check file size
    const maxSizeInBytes = (uploadOptions.maxSizeMB || 50) * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return createErrorResult(`File size exceeds ${uploadOptions.maxSizeMB}MB limit`);
    }
    
    // Create unique file path
    const filePath = createUniqueFilePath(file, {
      folder: uploadOptions.folder
    });
    
    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        contentType: uploadOptions.contentType || file.type,
        upsert: false
      });
    
    if (error) {
      console.error('Upload error:', error);
      return createErrorResult(error.message || 'Upload failed');
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return createSuccessResult(publicUrl);
  } catch (error: any) {
    console.error('Upload error:', error);
    return createErrorResult(error.message || 'Upload failed');
  }
};

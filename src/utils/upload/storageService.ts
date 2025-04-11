
import { supabase } from '@/integrations/supabase/client';
import { createUserFilePath, getBucketForFileType } from './fileUtils';

/**
 * Interface for upload options
 */
export interface UploadOptions {
  bucketName?: string;
  contentCategory?: string;
  upsert?: boolean;
  cacheControl?: string;
  contentType?: string;
  onProgress?: (progress: number) => void;
}

/**
 * Interface for upload result
 */
export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

/**
 * Upload a file to Supabase storage
 */
export const uploadFile = async (
  file: File, 
  userId: string,
  options?: UploadOptions | string
): Promise<UploadResult> => {
  try {
    // Handle string option as contentCategory for backwards compatibility
    let processedOptions: UploadOptions = {};
    if (typeof options === 'string') {
      processedOptions = { contentCategory: options };
    } else if (options) {
      processedOptions = options;
    }
    
    // Determine bucket based on options or file type
    const bucketName = processedOptions.bucketName || 
                       (processedOptions.contentCategory && getBucketForFileType(file, processedOptions.contentCategory)) || 
                       getBucketForFileType(file);
    
    // Create a unique path for the file
    const filePath = createUserFilePath(userId, file.name);
    
    console.log(`Uploading file to ${bucketName}/${filePath}`);
    
    // Prepare upload options
    const uploadOptions = {
      cacheControl: processedOptions.cacheControl || '3600',
      upsert: processedOptions.upsert !== undefined ? processedOptions.upsert : true,
      contentType: processedOptions.contentType || file.type
    };
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, uploadOptions);
    
    // Handle upload error
    if (error) {
      console.error("Storage upload error:", error);
      return {
        success: false,
        error: error.message || "Error uploading file"
      };
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data?.path || filePath);
    
    // Add cache buster
    const url = addCacheBuster(publicUrl);
    
    return {
      success: true,
      path: data?.path || filePath,
      url
    };
  } catch (error: any) {
    console.error("File upload error:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred during upload"
    };
  }
};

/**
 * Add cache busting parameter to URL
 */
export const addCacheBuster = (url: string): string => {
  if (!url) return '';
  
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  
  return url.includes('?') 
    ? `${url}&t=${timestamp}&r=${random}` 
    : `${url}?t=${timestamp}&r=${random}`;
};

/**
 * Get public URL for a file in storage
 */
export const getPublicUrl = (bucketName: string, filePath: string): string => {
  if (!filePath) return '';
  
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);
  
  return data.publicUrl;
};


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
      console.warn('String options for uploadFile are deprecated, use UploadOptions object instead');
    } else if (options) {
      processedOptions = options;
    }
    
    // Determine bucket based on options or file type
    const bucketName = processedOptions.bucketName || 
                       (processedOptions.contentCategory && getBucketForFileType(file, processedOptions.contentCategory)) || 
                       getBucketForFileType(file);
    
    // Create a unique path for the file
    const filePath = createUserFilePath(userId, file.name);
    
    console.log(`Uploading file to ${bucketName}/${filePath} with type ${file.type}`);
    
    // Ensure the file has the correct content type
    let contentType = processedOptions.contentType || file.type;
    
    // Fallback to determining content type from file extension if not set or generic
    if (!contentType || contentType === 'application/octet-stream') {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension) {
        // Map common extensions to MIME types
        const mimeMap: Record<string, string> = {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'gif': 'image/gif',
          'webp': 'image/webp',
          'svg': 'image/svg+xml',
          'mp4': 'video/mp4',
          'mov': 'video/quicktime',
          'webm': 'video/webm',
          'mp3': 'audio/mpeg',
          'wav': 'audio/wav',
        };
        contentType = mimeMap[extension] || 'application/octet-stream';
      }
    }
    
    console.log(`Determined content type: ${contentType} for file: ${file.name}`);
    
    // Prepare upload options
    const uploadOptions = {
      cacheControl: processedOptions.cacheControl || '3600',
      upsert: processedOptions.upsert !== undefined ? processedOptions.upsert : true,
      contentType
    };
    
    // Attempt upload
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, uploadOptions);
    
    // Handle upload error with retry
    if (error) {
      console.error("Storage upload error:", error);
      
      // If the bucket doesn't exist, we need to handle it
      if (error.message?.includes("The resource was not found") || 
          error.message?.includes("does not exist")) {
        
        // Try using a default 'media' bucket as fallback
        const { data: fallbackData, error: fallbackError } = await supabase.storage
          .from('media')
          .upload(filePath, file, uploadOptions);
        
        if (fallbackError) {
          return {
            success: false,
            error: `Upload failed: ${fallbackError.message}. The required storage bucket '${bucketName}' may not exist.`
          };
        }
        
        console.log(`Fallback upload successful using 'media' bucket`);
        
        // Get the public URL from the fallback bucket
        const { data: publicUrlData } = supabase.storage
          .from('media')
          .getPublicUrl(fallbackData?.path || filePath);
        
        return {
          success: true,
          path: fallbackData?.path || filePath,
          url: publicUrlData?.publicUrl ? addCacheBuster(publicUrlData.publicUrl) : undefined
        };
      }
      
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
  
  // Prevent recursive cache busting by checking for existing timestamp
  if (url.includes('t=') && url.includes('&r=')) {
    return url;
  }
  
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

/**
 * Update file metadata in storage
 */
export const updateFileMetadata = async (
  bucketName: string, 
  filePath: string, 
  contentType: string
): Promise<boolean> => {
  try {
    // Supabase doesn't have a direct API for updating metadata,
    // so we need to use a custom approach
    console.log(`Attempting to update metadata for ${bucketName}/${filePath} to ${contentType}`);

    // This is a placeholder for a more complete implementation
    // In a real implementation, you may need to use Supabase functions
    // or third-party tools to modify object metadata
    return true;
  } catch (error) {
    console.error("Failed to update file metadata:", error);
    return false;
  }
};

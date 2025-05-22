
import { MediaType, MediaAccessLevel, UploadOptions, UploadResult } from './types';
import { supabase } from '@/integrations/supabase/client';
import { createUniqueFilePath } from './fileUtils';

/**
 * Upload a file to storage
 */
export async function uploadFileToStorage(
  file: File, 
  options: UploadOptions = {}
): Promise<UploadResult> {
  if (!file) {
    return { success: false, error: 'No file provided' };
  }
  
  const {
    bucket = 'media',  // Default bucket is 'media' if not specified
    path,
    contentType = file.type,
    folder = '',
    accessLevel = MediaAccessLevel.PUBLIC
  } = options;
  
  try {
    // Generate file path if not provided
    const filePath = path || createUniqueFilePath(file, { folder });
    
    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        contentType,
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) {
      console.error('File upload error:', error);
      return { 
        success: false, 
        error: error.message,
      };
    }
    
    // Get the URL
    let url;
    if (accessLevel === MediaAccessLevel.PUBLIC) {
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);
      
      url = publicUrlData.publicUrl;
    } else {
      // For private files, create a signed URL
      const { data: signedUrlData } = await supabase.storage
        .from(bucket)
        .createSignedUrl(data.path, 60 * 60); // 1 hour expiration
        
      url = signedUrlData?.signedUrl;
    }
    
    return {
      success: true,
      url,
      publicUrl: url,
      path: data.path,
      accessLevel
    };
  } catch (err: any) {
    console.error('File upload unexpected error:', err);
    return {
      success: false,
      error: err.message || 'Unknown upload error',
    };
  }
}

// Re-export functions from other files to maintain backward compatibility
export { 
  extractMediaUrl, 
  normalizeMediaSource,
  determineMediaType 
} from './mediaSourceUtils';

export { 
  calculateAspectRatioDimensions 
} from './dimensionUtils';

export {
  createUniqueFilePath,
  formatFileSize
} from './fileUtils';

export {
  addCacheBuster,
  getPlayableMediaUrl
} from './urlUtils';

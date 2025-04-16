
import { supabase } from "@/integrations/supabase/client";
import { MediaType } from "@/utils/media/types";

/**
 * API Service for media operations
 */
export interface MediaUploadOptions {
  folder?: string;
  contentType?: string;
  maxSizeInMB?: number;
  userId?: string;
}

export interface MediaUploadResult {
  url: string | null;
  path: string | null;
  error: string | null;
  mimeType: string | null;
}

export interface MediaMetadata {
  contentType: string;
  size: number;
  dimensions?: { width: number; height: number };
  duration?: number;
}

/**
 * Upload media to Supabase storage
 */
export const uploadMedia = async (
  file: File,
  bucketName: string,
  options: MediaUploadOptions = {}
): Promise<MediaUploadResult> => {
  if (!file) {
    return { url: null, path: null, error: 'No file provided', mimeType: null };
  }

  const { folder = '', contentType, maxSizeInMB = 100, userId } = options;
  
  // Validate file size
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return { 
      url: null, 
      path: null, 
      error: `File size exceeds the maximum allowed (${maxSizeInMB}MB)`, 
      mimeType: file.type 
    };
  }
  
  try {
    // Generate a unique file path
    const timestamp = Date.now();
    const userPrefix = userId ? `${userId}/` : '';
    const folderPrefix = folder ? `${folder}/` : '';
    const fileExt = file.name.split('.').pop();
    const fileName = `${userPrefix}${folderPrefix}${timestamp}_${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        contentType: contentType || file.type,
        upsert: false
      });
      
    if (error) {
      console.error('Media upload error:', error);
      return { url: null, path: null, error: error.message, mimeType: file.type };
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);
      
    return {
      url: publicUrl,
      path: data.path,
      error: null,
      mimeType: file.type
    };
  } catch (error: any) {
    console.error('Media upload unexpected error:', error);
    return {
      url: null,
      path: null,
      error: error.message || 'Unknown error during upload',
      mimeType: file.type
    };
  }
};

/**
 * Delete media from Supabase storage
 */
export const deleteMedia = async (
  path: string,
  bucketName: string
): Promise<{ success: boolean; error: string | null }> => {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([path]);
      
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true, error: null };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || 'Unknown error during deletion' 
    };
  }
};

/**
 * Get metadata for a piece of media
 */
export const getMediaMetadata = async (
  path: string,
  bucketName: string
): Promise<MediaMetadata | null> => {
  try {
    // Get file metadata from storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(path.split('/').slice(0, -1).join('/'), {
        limit: 1,
        offset: 0,
        search: path.split('/').pop(),
      });
      
    if (error || !data || data.length === 0) {
      console.error('Error fetching metadata:', error);
      return null;
    }
    
    const file = data[0];
    
    return {
      contentType: file.metadata?.mimetype || '',
      size: file.metadata?.size || 0,
    };
  } catch (error) {
    console.error('Error in getMediaMetadata:', error);
    return null;
  }
};

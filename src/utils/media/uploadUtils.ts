
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { validateFileForUpload } from '@/utils/upload/validators';
import { MediaType } from '@/utils/media/types';
import { runFileDiagnostic } from '@/utils/upload/fileUtils';

export interface MediaUploadOptions {
  bucket?: string;
  contentType?: string;
  cacheControl?: string;
  upsert?: boolean;
  maxSizeMB?: number;
  metadata?: Record<string, string>;
  saveMetadata?: boolean;
}

export interface MediaUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  path?: string;
  fileType?: string;
  fileSize?: number;
  metadata?: Record<string, any>;
}

/**
 * Generate a unique storage path for uploaded media
 */
export function generateMediaStoragePath({
  userId,
  type,
  originalName
}: {
  userId: string;
  type: 'image' | 'video' | 'audio' | 'document';
  originalName: string;
}): string {
  const timestamp = Date.now();
  const fileExt = originalName.split('.').pop()?.toLowerCase() || 'unknown';
  const uuid = uuidv4().substring(0, 8);

  return `${type}s/${userId}/${uuid}_${timestamp}.${fileExt}`;
}

/**
 * Get MediaType enum from file or string type
 */
export function getMediaTypeFromFile(file: File): MediaType {
  const mimePrefix = file.type.split('/')[0];
  
  switch (mimePrefix) {
    case 'image': 
      return MediaType.IMAGE;
    case 'video': 
      return MediaType.VIDEO;
    case 'audio': 
      return MediaType.AUDIO;
    default: 
      return MediaType.DOCUMENT;
  }
}

/**
 * Unified function to upload media to Supabase storage
 */
export async function uploadMediaToSupabase({
  file,
  userId,
  options = {}
}: {
  file: File;
  userId: string;
  options?: MediaUploadOptions;
}): Promise<MediaUploadResult> {
  if (!file || !userId) {
    return { 
      success: false, 
      error: "Missing file or user ID" 
    };
  }

  try {
    // Run diagnostic for debugging
    const diagnostic = runFileDiagnostic(file);
    if (!diagnostic.valid) {
      console.error("File diagnostic failed:", diagnostic.message);
      return { 
        success: false, 
        error: diagnostic.message || "File diagnostic failed" 
      };
    }
    
    // Validate file size and type
    const maxSizeMB = options.maxSizeMB || 100; // Default 100MB max
    const validation = validateFileForUpload(file, maxSizeMB);
    if (!validation.valid) {
      return { 
        success: false, 
        error: validation.error 
      };
    }
    
    // Determine media type for path
    const mimePrefix = file.type.split('/')[0];
    let mediaType: 'image' | 'video' | 'audio' | 'document';
    
    switch (mimePrefix) {
      case 'image': 
        mediaType = 'image'; 
        break;
      case 'video': 
        mediaType = 'video'; 
        break;
      case 'audio': 
        mediaType = 'audio'; 
        break;
      default: 
        mediaType = 'document';
    }
    
    // Generate unique file path
    const filePath = generateMediaStoragePath({
      userId,
      type: mediaType,
      originalName: file.name
    });
    
    // Set up upload options
    const uploadOptions = {
      contentType: options.contentType || file.type,
      cacheControl: options.cacheControl || '3600',
      upsert: options.upsert ?? false,
      ...(options.metadata ? { metadata: options.metadata } : {})
    };
    
    // Determine storage bucket
    const bucket = options.bucket || 'media';
    
    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, uploadOptions);
      
    if (error) {
      console.error("Supabase upload error:", error);
      return { 
        success: false, 
        error: error.message || "Upload failed" 
      };
    }
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data?.path || filePath);
    
    if (!publicUrlData?.publicUrl) {
      return { 
        success: false, 
        error: "Failed to get public URL" 
      };
    }
    
    // Optional: Save metadata to database
    if (options.saveMetadata) {
      try {
        await supabase.from('media_assets').insert({
          user_id: userId,
          url: publicUrlData.publicUrl,
          type: mediaType,
          file_size: file.size,
          original_name: file.name,
          storage_path: filePath,
          content_type: file.type
        });
      } catch (metadataError: any) {
        // Log but don't fail the upload if metadata save fails
        console.error("Failed to save media metadata:", metadataError);
      }
    }
    
    // Return success with URL and metadata
    return {
      success: true,
      url: publicUrlData.publicUrl,
      path: filePath,
      fileType: file.type,
      fileSize: file.size,
      metadata: {
        originalName: file.name,
        contentType: file.type,
        mediaType
      }
    };
  } catch (error: any) {
    console.error("Unexpected upload error:", error);
    return { 
      success: false, 
      error: error.message || "An unexpected error occurred during upload" 
    };
  }
}

/**
 * Helper to update an existing media file
 */
export async function updateExistingMedia({
  file,
  userId,
  existingPath,
  options = {}
}: {
  file: File;
  userId: string;
  existingPath: string;
  options?: Omit<MediaUploadOptions, 'upsert'>;
}): Promise<MediaUploadResult> {
  return uploadMediaToSupabase({
    file,
    userId,
    options: {
      ...options,
      upsert: true
    }
  });
}

/**
 * Track media errors for monitoring
 */
export function reportMediaError(
  url: string,
  errorType: 'load_failure' | 'timeout' | 'format_error' | 'access_denied',
  attemptCount: number = 1,
  mediaType: string = 'unknown',
  componentName: string = 'unknown'
): void {
  // Log error for debugging
  console.error(`Media error [${errorType}]: ${url}`, {
    attemptCount,
    mediaType,
    componentName
  });
  
  // This can be expanded to send errors to an analytics service
  // or to your own error tracking endpoint
}

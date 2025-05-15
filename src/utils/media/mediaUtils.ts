
import { v4 as uuidv4 } from 'uuid';
import { MediaSource, MediaType } from './types';
import { extractMediaUrl } from './urlUtils';
import { supabase } from "@/integrations/supabase/client";

/**
 * Create a unique file path for uploading
 */
export function createUniqueFilePath(userId: string, file: File): string {
  // Get clean filename and extension
  const extension = getFileExtension(file);
  const baseFilename = file.name.replace(/\.[^/.]+$/, "");
  const sanitizedName = sanitizeFilename(baseFilename);
  
  // Generate a timestamp with random string to ensure uniqueness
  const timestamp = Date.now();
  const uniqueId = uuidv4().substring(0, 8);
  
  return `${userId}/${timestamp}_${uniqueId}_${sanitizedName}.${extension}`;
}

/**
 * Sanitize a filename for storage
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9-_]/gi, '_') // Replace non-alphanumeric with underscore
    .replace(/_{2,}/g, '_')        // Replace multiple underscores with single
    .replace(/^_+|_+$/g, '')       // Remove leading/trailing underscores
    .toLowerCase()
    .substring(0, 50);             // Limit length
}

/**
 * Get file extension from File object
 */
export function getFileExtension(file: File | string): string {
  if (typeof file === 'string') {
    // Extract extension from string URL or filename
    const parts = file.split('.');
    return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
  }
  
  // Extract from File object
  return file.name.split('.').pop()?.toLowerCase() || '';
}

/**
 * Determines the type of media based on the source or URL
 */
export function determineMediaType(source: MediaSource | string): MediaType {
  // If the source already has a media_type, use that
  if (typeof source !== 'string' && source.media_type) {
    return source.media_type;
  }
  
  // Extract URL for analysis
  const url = extractMediaUrl(source);
  if (!url) return MediaType.UNKNOWN;
  
  // Check extensions
  const extension = url.split('.').pop()?.toLowerCase();
  
  // Image types
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension || '')) {
    return MediaType.IMAGE;
  }
  
  // Video types
  if (['mp4', 'webm', 'mov', 'avi', 'mkv', 'wmv'].includes(extension || '')) {
    return MediaType.VIDEO;
  }
  
  // Audio types
  if (['mp3', 'wav', 'ogg', 'aac', 'm4a'].includes(extension || '')) {
    return MediaType.AUDIO;
  }
  
  // Document types
  if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extension || '')) {
    return MediaType.DOCUMENT;
  }
  
  // Check if the source object has video_url
  if (typeof source !== 'string' && source.video_url) {
    return MediaType.VIDEO;
  }
  
  return MediaType.UNKNOWN;
}

/**
 * Get appropriate MIME type for an extension
 */
export function getMimeTypeFromExtension(extension: string): string {
  const ext = extension.toLowerCase();
  
  // Image types
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'png') return 'image/png';
  if (ext === 'gif') return 'image/gif';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'svg') return 'image/svg+xml';
  
  // Video types
  if (ext === 'mp4') return 'video/mp4';
  if (ext === 'webm') return 'video/webm';
  if (ext === 'mov') return 'video/quicktime';
  
  // Audio types
  if (ext === 'mp3') return 'audio/mpeg';
  if (ext === 'wav') return 'audio/wav';
  if (ext === 'ogg') return 'audio/ogg';
  
  return 'application/octet-stream';
}

/**
 * Uploads a file to Supabase storage with proper validation
 */
export async function uploadFileToStorage(
  bucket: string,
  path: string,
  file: File
): Promise<{ success: boolean, url?: string, path?: string, error?: string }> {
  try {
    // Validate file before upload
    if (!file || !(file instanceof File) || file.size === 0) {
      console.error("❌ Invalid File passed to uploader", file);
      return {
        success: false,
        error: "Only raw File instances with data can be uploaded"
      };
    }
    
    // Log file debug info
    console.log("[FILE DEBUG]", {
      filename: file.name,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      type: file.type,
      lastModified: new Date(file.lastModified).toLocaleString()
    });
    
    // Upload to Supabase storage with proper content type
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType: file.type, // Set correct content type
        upsert: true           // Allow overwrites
      });
    
    if (error) {
      console.error("Storage upload error:", error);
      return {
        success: false,
        error: error.message
      };
    }
    
    if (!data || !data.path) {
      return {
        success: false,
        error: 'Upload successful but no path returned'
      };
    }
    
    // Get public URL for verification
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    // Verify URL is accessible
    try {
      const response = await fetch(urlData.publicUrl, { method: 'HEAD' });
      if (!response.ok) {
        console.warn(`Upload verification failed: ${response.status} ${response.statusText}`);
      }
    } catch (verifyError) {
      console.warn("Could not verify uploaded file URL:", verifyError);
    }
    
    return {
      success: true,
      path: data.path,
      url: urlData.publicUrl
    };
  } catch (error: any) {
    console.error("Storage upload error:", error);
    return {
      success: false,
      error: error.message || String(error)
    };
  }
}

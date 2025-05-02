
import { supabase } from '@/integrations/supabase/client';
import { MediaType, UploadResult } from './types';
import { getFileExtension } from './urlUtils';

/**
 * Creates a unique file path for storage
 * @param userId - The user ID
 * @param file - The file to create a path for
 * @returns A unique file path
 */
export function createUniqueFilePath(userId: string, file: File): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  return `${userId}/${timestamp}-${random}/${sanitizedFileName}`;
}

/**
 * Uploads a file to Supabase storage
 * @param bucket - The storage bucket
 * @param path - The file path
 * @param file - The file to upload
 * @returns The upload result
 */
export async function uploadFileToStorage(bucket: string, path: string, file: File): Promise<UploadResult> {
  try {
    // Perform the upload
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      });
    
    if (error) {
      console.error('Storage upload error:', error);
      return { 
        success: false, 
        error: error.message || 'Upload failed'
      };
    }
    
    if (!data || !data.path) {
      return { 
        success: false, 
        error: 'No data returned from upload'
      };
    }
    
    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return {
      success: true,
      url: publicUrlData.publicUrl,
      path: data.path
    };
  } catch (error: any) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error.message || 'An unknown error occurred'
    };
  }
}

/**
 * Gets a file from Supabase storage
 * @param bucket - The storage bucket
 * @param path - The file path
 * @returns The file data
 */
export async function getFileFromStorage(bucket: string, path: string): Promise<any> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path);
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting file from storage:', error);
    throw error;
  }
}

/**
 * Deletes a file from Supabase storage
 * @param bucket - The storage bucket
 * @param path - The file path
 * @returns Success status
 */
export async function deleteFileFromStorage(bucket: string, path: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting file from storage:', error);
    return false;
  }
}

/**
 * Determines the media type from a URL or MediaSource object
 * @param source - The media source (URL or object)
 * @returns The media type
 */
export function determineMediaType(source: any): MediaType {
  if (!source) return MediaType.UNKNOWN;
  
  // If it's a string URL
  if (typeof source === 'string') {
    const url = source.toLowerCase();
    
    // Check by extension
    if (url.match(/\.(jpe?g|png|gif|webp|svg)($|\?)/i)) return MediaType.IMAGE;
    if (url.match(/\.(mp4|webm|mov|avi|mkv)($|\?)/i)) return MediaType.VIDEO;
    if (url.match(/\.(mp3|wav|ogg|aac|m4a)($|\?)/i)) return MediaType.AUDIO;
    
    // Check by path patterns
    if (url.includes('/images/') || url.includes('/img/') || url.includes('/photos/')) {
      return MediaType.IMAGE;
    }
    if (url.includes('/videos/') || url.includes('/video/')) {
      return MediaType.VIDEO;
    }
    if (url.includes('/audio/') || url.includes('/sound/')) {
      return MediaType.AUDIO;
    }
    
    return MediaType.UNKNOWN;
  }
  
  // If it's a MediaSource object, try to determine from properties
  const mediaType = source.media_type;
  if (mediaType) {
    if (typeof mediaType === 'string') {
      switch (mediaType.toLowerCase()) {
        case 'image': return MediaType.IMAGE;
        case 'video': return MediaType.VIDEO;
        case 'audio': return MediaType.AUDIO;
        case 'file': return MediaType.FILE;
        default: break;
      }
    } else if (typeof MediaType === 'object' && mediaType as MediaType) {
      return mediaType as MediaType;
    }
  }
  
  // Check for specific URL properties
  if (source.video_url || source.video_urls) return MediaType.VIDEO;
  if (source.media_url && typeof source.media_url === 'string') {
    return determineMediaType(source.media_url);
  }
  
  return MediaType.UNKNOWN;
}

/**
 * Extracts the media URL from a string or MediaSource object
 * @param source - The source to extract URL from
 * @returns The extracted URL or null if not found
 */
export function extractMediaUrl(source: any): string | null {
  if (!source) return null;
  
  // If it's a string, return it directly
  if (typeof source === 'string') return source;
  
  // Try to extract from various properties
  return source.media_url || 
         source.video_url || 
         source.src || 
         source.url || 
         (source.media_urls && source.media_urls[0]) ||
         (source.video_urls && source.video_urls[0]) ||
         null;
}

/**
 * Optimizes an image for upload
 * @param file - The image file to optimize
 * @param maxWidth - Maximum width of the optimized image
 * @param quality - JPEG quality (0-1)
 * @returns A promise resolving to the optimized blob
 */
export async function optimizeImage(file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to optimize image'));
            }
          },
          file.type,
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
}

/**
 * Creates a thumbnail from a video file
 * @param videoFile - The video file
 * @param seekTime - Timestamp to capture (in seconds)
 * @returns A promise resolving to a blob of the thumbnail
 */
export async function createVideoThumbnail(videoFile: File, seekTime: number = 1): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const videoURL = URL.createObjectURL(videoFile);
    const video = document.createElement('video');
    
    video.src = videoURL;
    video.currentTime = seekTime;
    video.muted = true;
    
    video.onloadeddata = () => {
      // Create canvas and draw video frame
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to blob
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(videoURL);
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create video thumbnail'));
          }
        },
        'image/jpeg',
        0.7
      );
    };
    
    video.onerror = () => {
      URL.revokeObjectURL(videoURL);
      reject(new Error('Failed to load video'));
    };
  });
}

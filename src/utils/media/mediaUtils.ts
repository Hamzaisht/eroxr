import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { compressImage } from './imageCompression';
import { MediaType } from "./types";

/**
 * Uploads a file to Supabase storage
 * @param file - The file to upload
 * @param bucket - The bucket to upload to
 * @param folderPath - The folder path within the bucket
 * @returns The uploaded file's path and URL
 */
export async function uploadFileToStorage(file: File, bucket: string, folderPath: string | File = '') {
  try {
    // Handle if folderPath is actually a File (due to parameter order confusion in some calls)
    let actualFolderPath = '';
    if (typeof folderPath === 'string') {
      actualFolderPath = folderPath;
    } else if (folderPath instanceof File) {
      console.warn('uploadFileToStorage: folderPath parameter is a File, using empty string instead');
    }

    const filePath = createUniqueFilePath(file.name, actualFolderPath);
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);
    
    if (error) {
      throw error;
    }
    
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
      
    return {
      path: filePath,
      url: urlData?.publicUrl,
      success: true,
      error: null
    };
  } catch (error: any) {
    console.error('Error uploading file to storage:', error);
    return {
      path: '',
      url: '',
      success: false,
      error: error.message || 'Unknown error during upload'
    };
  }
}

/**
 * Creates a unique file path for storage
 * @param fileName - The original file name
 * @param folderPath - The folder path to prepend
 * @returns A unique file path
 */
export function createUniqueFilePath(fileName: string, folderPath: string = ''): string {
  const ext = fileName.split('.').pop() || '';
  const uniqueId = uuidv4();
  const basePath = folderPath ? `${folderPath}/` : '';
  
  return `${basePath}${uniqueId}.${ext}`;
}

/**
 * Fetches a file from storage
 * @param path - The file path
 * @param bucket - The bucket name
 * @returns The file data
 */
export async function getFileFromStorage(path: string, bucket: string) {
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
 * Deletes a file from storage
 * @param path - The file path
 * @param bucket - The bucket name
 */
export async function deleteFileFromStorage(path: string, bucket: string) {
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
    throw error;
  }
}

/**
 * Determines the media type from a file or URL
 * @param fileOrUrl - A file object or URL string
 * @returns The determined media type
 */
export function determineMediaType(fileOrUrl: File | string | null | undefined): MediaType {
  // Handle null or undefined input
  if (fileOrUrl === null || fileOrUrl === undefined) {
    console.warn('determineMediaType called with null or undefined value');
    return MediaType.UNKNOWN;
  }
  
  // Handle File objects
  if (fileOrUrl instanceof File) {
    const type = fileOrUrl.type;
    
    if (type.startsWith('image/')) {
      return MediaType.IMAGE;
    }
    
    if (type.startsWith('video/')) {
      return MediaType.VIDEO;
    }
    
    if (type.startsWith('audio/')) {
      return MediaType.AUDIO;
    }
    
    return MediaType.FILE;
  }
  
  // Handle URLs - ensure it's a string
  if (typeof fileOrUrl === 'string') {
    const url = fileOrUrl.toLowerCase();
    const ext = url.split('.').pop()?.split('?')[0] || '';
    
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
    const videoExts = ['mp4', 'webm', 'mov', 'avi', 'mkv', 'flv'];
    const audioExts = ['mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac'];
    
    if (imageExts.includes(ext)) {
      return MediaType.IMAGE;
    }
    
    if (videoExts.includes(ext)) {
      return MediaType.VIDEO;
    }
    
    if (audioExts.includes(ext)) {
      return MediaType.AUDIO;
    }
    
    return MediaType.FILE;
  }
  
  // If it's neither a File nor a string, return UNKNOWN
  console.warn('determineMediaType called with invalid type:', typeof fileOrUrl);
  return MediaType.UNKNOWN;
}

/**
 * Extracts a media URL from various data structures
 * @param data - The data to extract from
 * @returns The extracted URL or empty string
 */
export function extractMediaUrl(data: any): string {
  if (!data) return '';
  
  if (typeof data === 'string') {
    return data;
  }
  
  if (Array.isArray(data) && data.length > 0) {
    return typeof data[0] === 'string' ? data[0] : '';
  }
  
  // Handle common properties that might contain URLs
  if (data.media_url) {
    return Array.isArray(data.media_url) ? data.media_url[0] : data.media_url;
  }
  
  if (data.url) return data.url;
  if (data.src) return data.src;
  if (data.video_url) return data.video_url;
  if (data.image) return data.image;
  
  return '';
}

/**
 * Optimizes an image by resizing and compressing it
 * @param file - The image file to optimize
 * @param maxWidth - Maximum width in pixels
 * @param maxHeight - Maximum height in pixels
 * @param quality - JPEG quality (0-1)
 * @returns A promise that resolves to the optimized blob
 */
export async function optimizeImage(
  file: File,
  maxWidth: number = 1200,
  maxHeight: number = 1200,
  quality: number = 0.85
): Promise<Blob> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Not an image file');
  }
  
  try {
    // Use the imported compressImage function
    return await compressImage(file, { maxWidth, maxHeight, quality });
  } catch (error) {
    console.error('Error optimizing image:', error);
    throw error;
  }
}

/**
 * Creates a thumbnail from a video file
 * @param videoFile - The video file
 * @param seekTo - Seconds into the video to capture the thumbnail
 * @returns A promise that resolves to the thumbnail blob
 */
export async function createVideoThumbnail(
  videoFile: File, 
  seekTo: number = 1
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      // Create video element
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      
      // Create object URL for video
      const videoUrl = URL.createObjectURL(videoFile);
      
      // Set up event handlers
      video.onloadedmetadata = () => {
        // Seek to the specified time
        video.currentTime = Math.min(seekTo, video.duration * 0.25);
      };
      
      video.onseeked = () => {
        // Create canvas at video dimensions
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Set canvas size
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw the video frame on the canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create thumbnail blob'));
            }
            
            // Clean up
            URL.revokeObjectURL(videoUrl);
          },
          'image/jpeg',
          0.8
        );
      };
      
      video.onerror = () => {
        URL.revokeObjectURL(videoUrl);
        reject(new Error('Error loading video'));
      };
      
      // Start loading video
      video.src = videoUrl;
    } catch (error) {
      reject(error);
    }
  });
}

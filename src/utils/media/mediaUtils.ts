
import { supabase } from '@/integrations/supabase/client';
import { MediaType, MediaSource } from './types';

// Create a unique file path for storage
export const createUniqueFilePath = (userId: string, file: File): string => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  const fileExt = file.name.split('.').pop();
  return `${userId}/${timestamp}-${random}.${fileExt}`;
};

// Upload file to Supabase storage
export const uploadFileToStorage = async (
  bucketName: string,
  filePath: string,
  file: File
): Promise<{ success: boolean; error?: string; url?: string }> => {
  try {
    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Error uploading file:', error);
      return {
        success: false,
        error: error.message
      };
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    if (!urlData || !urlData.publicUrl) {
      return {
        success: false,
        error: 'Failed to get public URL'
      };
    }

    return {
      success: true,
      url: urlData.publicUrl
    };
  } catch (error: any) {
    console.error('Unexpected error uploading file:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred'
    };
  }
};

// Get a file from storage
export const getFileFromStorage = async (bucketName: string, filePath: string): Promise<Blob | null> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(filePath);

    if (error) {
      console.error('Error downloading file:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error downloading file:', error);
    return null;
  }
};

// Delete a file from storage
export const deleteFileFromStorage = async (bucketName: string, filePath: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting file:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error deleting file:', error);
    return false;
  }
};

// Helper function to optimize an image before upload
export const optimizeImage = async (
  file: File,
  maxWidth = 1200,
  quality = 0.8
): Promise<File> => {
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

        // Calculate new dimensions if needed
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Could not create blob'));
              return;
            }
            
            // Create a new file from the blob
            const optimizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            
            resolve(optimizedFile);
          },
          file.type,
          quality
        );
      };
      img.onerror = () => {
        reject(new Error('Error loading image'));
      };
    };
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
  });
};

// Helper function to create a video thumbnail from a video file
export const createVideoThumbnail = async (
  file: File,
  seekTo = 1.0
): Promise<File | null> => {
  return new Promise((resolve) => {
    try {
      const videoUrl = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.src = videoUrl;
      
      // Seek to the specified time to capture thumbnail
      video.currentTime = seekTo;
      
      // Once metadata is loaded, seek to the specified time
      video.addEventListener('loadedmetadata', () => {
        video.currentTime = Math.min(seekTo, video.duration / 2);
      });
      
      // When the frame at the seek position is available
      video.addEventListener('seeked', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          // Clean up
          URL.revokeObjectURL(videoUrl);
          
          if (!blob) {
            resolve(null);
            return;
          }
          
          // Create a thumbnail file
          const thumbnailFile = new File([blob], `${file.name.split('.')[0]}.jpg`, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          
          resolve(thumbnailFile);
        }, 'image/jpeg', 0.7);
      });
      
      // Handle errors
      video.addEventListener('error', () => {
        URL.revokeObjectURL(videoUrl);
        resolve(null);
      });
      
    } catch (error) {
      console.error('Error creating video thumbnail:', error);
      resolve(null);
    }
  });
};

// Determine media type from source
export function determineMediaType(source: MediaSource | string): MediaType {
  // If it's a string, determine type from URL extension
  if (typeof source === 'string') {
    const url = source.toLowerCase();
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)($|\?)/i)) return MediaType.IMAGE;
    if (url.match(/\.(mp4|webm|mov|avi|wmv)($|\?)/i)) return MediaType.VIDEO;
    if (url.match(/\.(mp3|wav|ogg|m4a)($|\?)/i)) return MediaType.AUDIO;
    return MediaType.FILE;
  }
  
  // If it's a MediaSource object
  if (source.media_type) {
    // If media_type is already a MediaType enum value, return it
    if (typeof source.media_type === 'string') {
      return source.media_type as MediaType;
    }
  }
  
  // Try to infer from available URLs
  if (source.video_url || source.video_urls) {
    return MediaType.VIDEO;
  }
  
  if (source.media_url) {
    const url = source.media_url.toLowerCase();
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)($|\?)/i)) return MediaType.IMAGE;
    if (url.match(/\.(mp4|webm|mov|avi|wmv)($|\?)/i)) return MediaType.VIDEO;
    if (url.match(/\.(mp3|wav|ogg|m4a)($|\?)/i)) return MediaType.AUDIO;
  }
  
  // Default to FILE when uncertain
  return MediaType.FILE;
}

// Extract media URL from various source formats
export function extractMediaUrl(source: MediaSource | string): string | null {
  if (typeof source === 'string') {
    return source;
  }
  
  // Extract from MediaSource object
  if (source.media_url) {
    return source.media_url;
  }
  
  if (source.video_url) {
    return source.video_url;
  }
  
  if (source.media_urls && source.media_urls.length > 0) {
    return source.media_urls[0];
  }
  
  if (source.video_urls && source.video_urls.length > 0) {
    return source.video_urls[0];
  }
  
  return null;
}


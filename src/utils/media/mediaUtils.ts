
import { supabase } from "@/integrations/supabase/client";
import { runFileDiagnostic } from "@/utils/upload/fileUtils";
import { MediaType } from "./types";
import { isImageUrl, isVideoUrl, isAudioUrl } from "./urlUtils";

/**
 * Creates a unique file path for storage
 */
export const createUniqueFilePath = (userId: string, file: File): string => {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 10);
  const fileExt = file.name.split('.').pop();
  return `${userId}/${timestamp}_${randomString}.${fileExt}`;
};

/**
 * Uploads a file to Supabase storage
 */
export const uploadFileToStorage = async (
  bucket: string,
  path: string,
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // Run diagnostics before upload
    runFileDiagnostic(file);
    
    if (!file || !(file instanceof File) || file.size === 0) {
      return { 
        success: false, 
        error: "Invalid file object"
      };
    }
    
    console.log(`Uploading to ${bucket}/${path}`);
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      });
    
    if (error) {
      console.error("Upload error:", error);
      return { 
        success: false, 
        error: error.message 
      };
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return { 
      success: true, 
      url: publicUrl 
    };
  } catch (error: any) {
    console.error("Storage upload error:", error);
    return { 
      success: false, 
      error: error.message || "An unknown error occurred" 
    };
  }
};

/**
 * Determines the type of media from a source
 * @param source - Media source object or URL string
 * @returns MediaType enum value
 */
export function determineMediaType(source: any): MediaType {
  if (!source) return MediaType.UNKNOWN;
  
  // If source has an explicit media_type, use it
  if (typeof source === 'object' && source.media_type) {
    return source.media_type as MediaType;
  }
  
  // If source is a string URL
  if (typeof source === 'string') {
    if (isVideoUrl(source)) return MediaType.VIDEO;
    if (isImageUrl(source)) return MediaType.IMAGE;
    if (isAudioUrl(source)) return MediaType.AUDIO;
    return MediaType.UNKNOWN;
  }
  
  // For object sources, check properties
  if (typeof source === 'object') {
    const url = source.url || source.video_url || source.media_url || '';
    
    // Check for specific media properties
    if (source.video_url || source.content_type === 'video') {
      return MediaType.VIDEO;
    }
    
    if (source.media_url || source.content_type === 'image') {
      return MediaType.IMAGE;
    }
    
    // Fallback to URL extension analysis
    if (isVideoUrl(url)) return MediaType.VIDEO;
    if (isImageUrl(url)) return MediaType.IMAGE;
    if (isAudioUrl(url)) return MediaType.AUDIO;
  }
  
  return MediaType.UNKNOWN;
}

/**
 * Extract a media URL from a MediaSource object or string
 */
export function extractMediaUrl(source: any): string | null {
  if (!source) return null;
  
  // If source is already a string, return it
  if (typeof source === 'string') {
    return source;
  }
  
  // Try all possible URL fields in the MediaSource object
  return source.url || 
         source.video_url || 
         source.media_url || 
         source.src || 
         (source.video_urls && source.video_urls.length > 0 ? source.video_urls[0] : null) ||
         (source.media_urls && source.media_urls.length > 0 ? source.media_urls[0] : null) ||
         null;
}

/**
 * Optimizes an image for upload (reduces size)
 */
export const optimizeImage = async (file: File, maxWidth = 1920): Promise<File> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress image
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          }));
        } else {
          // Fallback to original if optimization fails
          resolve(file);
        }
      }, 'image/jpeg', 0.85); // Adjust quality as needed
      
      URL.revokeObjectURL(img.src);
    };
    
    img.onerror = () => {
      // Fallback to original if load fails
      URL.revokeObjectURL(img.src);
      resolve(file);
    };
  });
};

/**
 * Creates a thumbnail from a video file
 */
export const createVideoThumbnail = (videoFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Create video element
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    
    // Set up video events
    video.onloadedmetadata = () => {
      // Seek to 25% of the video
      video.currentTime = Math.min(video.duration * 0.25, 3.0);
    };
    
    video.oncanplay = () => {
      try {
        // Create canvas and draw video frame
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Canvas context could not be created');
        }
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL
        const dataURL = canvas.toDataURL('image/jpeg', 0.8);
        
        // Clean up
        URL.revokeObjectURL(video.src);
        video.remove();
        
        resolve(dataURL);
      } catch (error) {
        reject(error);
      }
    };
    
    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('Error generating video thumbnail'));
    };
    
    // Start loading the video
    video.src = URL.createObjectURL(videoFile);
  });
};

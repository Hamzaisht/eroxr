
import { supabase } from "@/integrations/supabase/client";
import { runFileDiagnostic } from "@/utils/upload/fileUtils";

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

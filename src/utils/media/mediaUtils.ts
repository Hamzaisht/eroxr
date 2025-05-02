
import { supabase } from '@/integrations/supabase/client';

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

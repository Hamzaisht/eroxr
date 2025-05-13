
import { MediaType } from './media/types';
import { getPlayableMediaUrl } from './media/mediaUrlUtils';

export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

export const isVideoFile = (file: File): boolean => {
  return file.type.startsWith('video/');
};

export const getMediaTypeFromFile = (file: File): MediaType => {
  if (isImageFile(file)) {
    return MediaType.IMAGE;
  } else if (isVideoFile(file)) {
    return MediaType.VIDEO;
  } else {
    return MediaType.UNKNOWN;
  }
};

// Re-export the getPlayableMediaUrl function
export { getPlayableMediaUrl };

/**
 * Optimizes an image for upload by resizing and compressing it
 * @param file - The image file to optimize
 * @param options - Options for optimization (maxWidth, maxHeight, quality)
 * @returns A Promise that resolves to the optimized image as a Blob
 */
export async function optimizeImage(
  file: File,
  options = { maxWidth: 1920, maxHeight: 1920, quality: 0.85 }
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        // Create canvas for resizing
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate dimensions to maintain aspect ratio
        if (width > options.maxWidth || height > options.maxHeight) {
          if (width > height) {
            height *= options.maxWidth / width;
            width = options.maxWidth;
          } else {
            width *= options.maxHeight / height;
            height = options.maxHeight;
          }
        }
        
        // Set canvas dimensions and draw resized image
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to blob with specified quality
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob from canvas'));
            }
          },
          'image/jpeg',
          options.quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
  });
}

/**
 * Creates a thumbnail from a video file
 * @param videoFile - The video file to create thumbnail from
 * @param maxSize - Maximum thumbnail dimension
 * @returns A Promise that resolves to the thumbnail as a Blob
 */
export async function createVideoThumbnail(
  videoFile: File,
  maxSize = 480
): Promise<Blob | null> {
  return new Promise((resolve) => {
    try {
      // Create video element to capture frame
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      // Create a blob URL for the video
      const videoUrl = URL.createObjectURL(videoFile);
      
      video.onloadedmetadata = () => {
        // Seek to a third through the video for a representative frame
        video.currentTime = video.duration / 3;
      };
      
      video.oncanplay = () => {
        // Create a canvas to draw the thumbnail
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          console.error('Failed to get 2D context for thumbnail creation');
          URL.revokeObjectURL(videoUrl);
          resolve(null);
          return;
        }
        
        // Calculate dimensions maintaining aspect ratio
        let width = video.videoWidth;
        let height = video.videoHeight;
        
        if (width > height) {
          if (width > maxSize) {
            height = height * (maxSize / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = width * (maxSize / height);
            height = maxSize;
          }
        }
        
        // Set canvas size and draw video frame
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(video, 0, 0, width, height);
        
        // Convert to blob
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(videoUrl);
            resolve(blob);
          },
          'image/jpeg',
          0.85
        );
      };
      
      video.onerror = () => {
        console.error('Error creating video thumbnail');
        URL.revokeObjectURL(videoUrl);
        resolve(null);
      };
      
      // Start loading the video
      video.src = videoUrl;
      
      // Set a timeout in case the video never loads/errors
      setTimeout(() => {
        if (!video.duration) {
          console.warn('Video thumbnail creation timed out');
          URL.revokeObjectURL(videoUrl);
          resolve(null);
        }
      }, 5000);
    } catch (err) {
      console.error('Error in thumbnail creation:', err);
      resolve(null);
    }
  });
}


/**
 * Validates if a file is a properly formatted video file
 * @param file Video file to validate
 * @returns Promise resolving to boolean indicating if video is valid
 */
export const validateVideoFormat = async (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      // Check if file type starts with 'video/'
      if (!file.type.startsWith('video/')) {
        console.warn('File is not a video type:', file.type);
        resolve(false);
        return;
      }
      
      // Create a video element to test loading
      const video = document.createElement('video');
      const objectUrl = URL.createObjectURL(file);
      
      // Set up event listeners
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(true);
      };
      
      video.onerror = () => {
        console.warn('Error loading video file');
        URL.revokeObjectURL(objectUrl);
        resolve(false);
      };
      
      // Try to load the video
      video.src = objectUrl;
      
      // Set a timeout to handle videos that don't trigger events
      setTimeout(() => {
        if (video.readyState === 0) {
          console.warn('Video load timed out');
          URL.revokeObjectURL(objectUrl);
          resolve(false);
        }
      }, 3000);
    } catch (error) {
      console.error('Error validating video format:', error);
      resolve(false);
    }
  });
};

/**
 * Gets the duration of a video file
 * @param file Video file
 * @returns Promise resolving to duration in seconds
 */
export const getVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    try {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      
      video.onerror = (error) => {
        URL.revokeObjectURL(video.src);
        reject(new Error(`Failed to load video metadata: ${error}`));
      };
      
      video.src = URL.createObjectURL(file);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generates a thumbnail from a video file at a specific time
 * @param videoFile Video file to get thumbnail from
 * @param timeInSeconds Time position for thumbnail (default: 0)
 * @returns Promise resolving to thumbnail blob
 */
export const generateVideoThumbnail = (
  videoFile: File, 
  timeInSeconds = 0
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      const video = document.createElement('video');
      const objectUrl = URL.createObjectURL(videoFile);
      
      video.onloadedmetadata = () => {
        // Seek to the specific time
        video.currentTime = Math.min(timeInSeconds, video.duration / 2);
        
        video.onseeked = () => {
          try {
            // Create canvas and draw video frame
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              throw new Error('Failed to get canvas context');
            }
            
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Convert canvas to blob
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  URL.revokeObjectURL(objectUrl);
                  resolve(blob);
                } else {
                  reject(new Error('Failed to create thumbnail blob'));
                }
              },
              'image/jpeg',
              0.7 // Quality
            );
          } catch (error) {
            URL.revokeObjectURL(objectUrl);
            reject(error);
          }
        };
      };
      
      video.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Error loading video for thumbnail generation'));
      };
      
      video.src = objectUrl;
    } catch (error) {
      reject(error);
    }
  });
};

// Alias for backward compatibility
export const generateVideoThumbnails = generateVideoThumbnail;

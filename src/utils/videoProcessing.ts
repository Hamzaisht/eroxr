
/**
 * Utility functions for validating and processing video files
 */

/**
 * Validate that a file is a valid video format
 * @param file File to validate
 * @returns Promise resolving to boolean indicating if it's a valid video
 */
export const validateVideoFormat = async (file: File): Promise<boolean> => {
  if (!file.type.startsWith('video/')) {
    return false;
  }
  
  try {
    // Create a URL for the file
    const url = URL.createObjectURL(file);
    
    // Create a video element to test loading
    const video = document.createElement('video');
    
    // Wait for either error or metadata to load
    const result = await new Promise<boolean>((resolve) => {
      video.onloadedmetadata = () => {
        resolve(true);
      };
      
      video.onerror = () => {
        resolve(false);
      };
      
      // Set source and try to load
      video.src = url;
    });
    
    // Clean up
    URL.revokeObjectURL(url);
    return result;
  } catch (error) {
    console.error('Error validating video format:', error);
    return false;
  }
};

/**
 * Get the duration of a video file in seconds
 * @param file Video file to check
 * @returns Promise resolving to duration in seconds
 */
export const getVideoDuration = async (file: File): Promise<number> => {
  try {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    
    const duration = await new Promise<number>((resolve, reject) => {
      video.onloadedmetadata = () => {
        resolve(video.duration);
      };
      
      video.onerror = () => {
        reject(new Error('Could not load video metadata'));
      };
      
      video.src = url;
    });
    
    URL.revokeObjectURL(url);
    return duration;
  } catch (error) {
    console.error('Error getting video duration:', error);
    return 0;
  }
};

/**
 * Utilities to create a thumbnail from a video at a specific timestamp
 * @param videoFile Video file to create thumbnail from
 * @param timeInSeconds Time in seconds to capture thumbnail
 * @returns Promise resolving to Blob of thumbnail image
 */
export const createThumbnailFromVideo = async (
  videoFile: File, 
  timeInSeconds = 0
): Promise<Blob | null> => {
  try {
    const url = URL.createObjectURL(videoFile);
    const video = document.createElement('video');
    video.src = url;
    
    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => {
        // Ensure time is within video duration
        const seekTime = Math.min(timeInSeconds, video.duration / 2);
        video.currentTime = seekTime;
      };
      
      video.onseeked = () => {
        resolve();
      };
      
      video.onerror = () => {
        reject(new Error('Error loading video'));
      };
    });
    
    // Draw the video frame to a canvas
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to blob
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.7);
    });
    
    // Clean up
    URL.revokeObjectURL(url);
    
    return blob;
  } catch (error) {
    console.error('Error creating thumbnail:', error);
    return null;
  }
};

/**
 * Generate multiple thumbnails from a video file
 * @param videoFile Video file to create thumbnails from
 * @param count Number of thumbnails to generate
 * @returns Promise resolving to array of thumbnail URLs
 */
export const generateVideoThumbnails = async (
  videoFile: File, 
  count = 3
): Promise<string[]> => {
  try {
    const duration = await getVideoDuration(videoFile);
    if (!duration) {
      throw new Error("Could not determine video duration");
    }

    const thumbnailURLs: string[] = [];
    
    // Generate thumbnails at evenly spaced intervals
    for (let i = 0; i < count; i++) {
      // Get time points at 10%, 50%, 90% of the duration
      const timePoint = duration * (i + 1) / (count + 1);
      const thumbnailBlob = await createThumbnailFromVideo(videoFile, timePoint);
      
      if (thumbnailBlob) {
        const thumbnailURL = URL.createObjectURL(thumbnailBlob);
        thumbnailURLs.push(thumbnailURL);
      }
    }
    
    return thumbnailURLs;
  } catch (error) {
    console.error('Error generating thumbnails:', error);
    return [];
  }
};

/**
 * Utility function to add file extension if missing
 * @param filename Filename to check
 * @param extension Extension to add if missing (without dot)
 * @returns Filename with extension
 */
export const ensureFileExtension = (filename: string, extension: string): string => {
  if (!filename.toLowerCase().endsWith(`.${extension.toLowerCase()}`)) {
    return `${filename}.${extension}`;
  }
  return filename;
};

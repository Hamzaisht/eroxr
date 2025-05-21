
/**
 * Generate a thumbnail from a video file
 * @param videoFile Video file to generate thumbnail from
 * @param seekTime Time in seconds to seek to for the thumbnail
 * @returns Promise resolving to the thumbnail data URL
 */
export const generateVideoThumbnail = async (
  videoFile: File,
  seekTime = 1
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      if (!videoFile.type.startsWith('video/')) {
        reject(new Error('Not a video file'));
        return;
      }

      const videoUrl = URL.createObjectURL(videoFile);
      const video = document.createElement('video');
      video.src = videoUrl;
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.currentTime = seekTime;

      // When video can be played, capture the frame
      video.onloadeddata = () => {
        // If the video is very short, use a valid time
        if (video.duration < seekTime) {
          video.currentTime = video.duration / 2;
        }

        video.onseeked = () => {
          // Create canvas at the video frame size
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          // Draw the video frame
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not create canvas context'));
            return;
          }
          
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Convert to data URL
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          
          // Clean up resources
          URL.revokeObjectURL(videoUrl);
          
          resolve(dataUrl);
        };
      };
      
      video.onerror = () => {
        URL.revokeObjectURL(videoUrl);
        reject(new Error('Error loading video'));
      };
      
      // Start loading the video
      video.load();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generate a thumbnail from a video URL
 * @param videoUrl Video URL to generate thumbnail from
 * @param seekTime Time in seconds to seek to for the thumbnail
 * @returns Promise resolving to the thumbnail data URL
 */
export const generateThumbnailFromUrl = async (
  videoUrl: string,
  seekTime = 1
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const video = document.createElement('video');
      video.src = videoUrl;
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.currentTime = seekTime;
      
      // When video can be played, capture the frame
      video.onloadeddata = () => {
        // If the video is very short, use a valid time
        if (video.duration < seekTime) {
          video.currentTime = video.duration / 2;
        }
        
        video.onseeked = () => {
          // Create canvas at the video frame size
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          // Draw the video frame
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not create canvas context'));
            return;
          }
          
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Convert to data URL
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          
          resolve(dataUrl);
        };
      };
      
      video.onerror = () => {
        reject(new Error('Error loading video'));
      };
      
      // Start loading the video
      video.load();
    } catch (error) {
      reject(error);
    }
  });
};

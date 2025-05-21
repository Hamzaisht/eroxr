
/**
 * Generates a thumbnail image from a video file
 * @param file The video file to generate a thumbnail from
 * @param seekTime Optional time in seconds to seek to for the thumbnail (default: 1)
 * @returns Promise resolving to a data URL containing the thumbnail or null if generation failed
 */
export async function generateVideoThumbnail(
  file: File,
  seekTime: number = 1
): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      // Create video element
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const url = URL.createObjectURL(file);
      
      // Set up video properties
      video.src = url;
      video.preload = 'metadata';
      video.playsInline = true;
      video.muted = true;
      
      // Handle successful video load
      video.onloadedmetadata = () => {
        // Seek to specific time for thumbnail
        video.currentTime = Math.min(seekTime, video.duration / 2);
      };
      
      // Generate thumbnail when frame is available
      video.onseeked = () => {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw the current video frame to canvas
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Convert canvas to data URL
          try {
            const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
            resolve(thumbnail);
          } catch (e) {
            console.error("Error creating thumbnail:", e);
            resolve(null);
          }
        } else {
          resolve(null);
        }
        
        // Clean up
        URL.revokeObjectURL(url);
      };
      
      // Handle errors
      video.onerror = () => {
        console.error("Error loading video for thumbnail generation");
        URL.revokeObjectURL(url);
        resolve(null);
      };
      
    } catch (error) {
      console.error("Video thumbnail generation failed:", error);
      resolve(null);
    }
  });
}

/**
 * Creates a thumbnail from a video URL rather than a File object
 * @param videoUrl URL of the video to create thumbnail from
 * @returns Promise resolving to a data URL of the thumbnail or null
 */
export async function generateThumbnailFromUrl(
  videoUrl: string
): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      
      // Configure video
      video.crossOrigin = 'anonymous'; // Required for some remote videos
      video.src = videoUrl;
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        // Seek to 1 second or 25% of video duration
        const seekTime = Math.min(1, video.duration * 0.25);
        video.currentTime = seekTime;
      };
      
      video.onseeked = () => {
        // Set canvas size to match video dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw current frame to canvas
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          try {
            const thumbnail = canvas.toDataURL('image/jpeg', 0.7);
            resolve(thumbnail);
          } catch (e) {
            console.error("Error creating thumbnail from URL:", e);
            resolve(null);
          }
        } else {
          resolve(null);
        }
      };
      
      video.onerror = () => {
        console.error("Error loading video from URL for thumbnail");
        resolve(null);
      };
      
    } catch (error) {
      console.error("Error generating thumbnail from URL:", error);
      resolve(null);
    }
  });
}

export const validateVideoFormat = async (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(true);
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      resolve(false);
    };

    const timeout = setTimeout(() => {
      URL.revokeObjectURL(video.src);
      resolve(false);
    }, 5000);

    video.onloadedmetadata = () => {
      clearTimeout(timeout);
      URL.revokeObjectURL(video.src);
      resolve(true);
    };

    video.src = URL.createObjectURL(file);
  });
};

export const getVideoDuration = async (file: File): Promise<number> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    const timeout = setTimeout(() => {
      URL.revokeObjectURL(video.src);
      resolve(0);
    }, 5000);

    video.onloadedmetadata = () => {
      clearTimeout(timeout);
      URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };

    video.onerror = () => {
      clearTimeout(timeout);
      URL.revokeObjectURL(video.src);
      resolve(0);
    };

    video.src = URL.createObjectURL(file);
  });
};

// Helper function to generate video thumbnails with better error handling
export const generateVideoThumbnails = async (videoFile: File, numThumbnails = 3): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const thumbnails: string[] = [];
    
    if (!ctx) {
      reject(new Error('Failed to create canvas context'));
      return;
    }
    
    let loadError = false;
    
    video.addEventListener('loadedmetadata', () => {
      if (loadError) return;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const duration = video.duration;
      // Calculate evenly spaced time points
      const timePoints = Array.from({length: numThumbnails}, (_, i) => 
        duration * (i + 1) / (numThumbnails + 1)
      );
      
      let loaded = 0;
      
      const processThumbnail = () => {
        if (loaded >= timePoints.length) {
          URL.revokeObjectURL(video.src);
          resolve(thumbnails);
          return;
        }
        
        const currentTime = timePoints[loaded];
        video.currentTime = currentTime;
      };
      
      video.addEventListener('seeked', () => {
        if (loadError) return;
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        thumbnails.push(canvas.toDataURL('image/jpeg', 0.7)); // Add quality parameter for better performance
        loaded++;
        
        if (loaded < timePoints.length) {
          processThumbnail();
        } else {
          URL.revokeObjectURL(video.src);
          resolve(thumbnails);
        }
      });
      
      // Start the process
      processThumbnail();
    });
    
    video.addEventListener('error', (e) => {
      loadError = true;
      URL.revokeObjectURL(video.src);
      reject(new Error('Error generating thumbnails: ' + (e.message || 'Unknown error')));
    });
    
    video.src = URL.createObjectURL(videoFile);
  });
};

// New function to apply watermark on video during processing
export const applyWatermarkToVideo = async (
  videoElement: HTMLVideoElement,
  username: string
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Set canvas size to match video
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      
      // Draw video frame to canvas
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      
      // Add watermark
      const watermarkText = `www.eroxr.com/@${username}`;
      const fontSize = Math.max(16, Math.min(canvas.width * 0.025, 24));
      
      ctx.font = `600 ${fontSize}px sans-serif`;
      ctx.fillStyle = 'white';
      
      // Measure text for positioning
      const metrics = ctx.measureText(watermarkText);
      const textWidth = metrics.width;
      
      // Position at bottom right with padding
      const padding = fontSize / 2;
      const x = canvas.width - textWidth - padding;
      const y = canvas.height - padding;
      
      // Add background for better visibility
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(
        x - padding / 2,
        y - fontSize - padding / 2,
        textWidth + padding,
        fontSize + padding
      );
      
      // Draw text
      ctx.fillStyle = 'white';
      ctx.fillText(watermarkText, x, y - padding / 2);
      
      // Convert canvas to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert canvas to blob'));
          }
        },
        'image/jpeg',
        0.95
      );
    } catch (error) {
      reject(error);
    }
  });
};

// Function to watermark an individual frame (for livestreams)
export const watermarkVideoFrame = (
  videoElement: HTMLVideoElement,
  username: string,
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): void => {
  // Draw current video frame
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  
  // Add watermark
  const watermarkText = `www.eroxr.com/@${username}`;
  const fontSize = Math.max(16, Math.min(canvas.width * 0.025, 24));
  
  ctx.font = `600 ${fontSize}px sans-serif`;
  ctx.fillStyle = 'white';
  
  // Measure text for positioning
  const metrics = ctx.measureText(watermarkText);
  const textWidth = metrics.width;
  
  // Position at bottom right with padding
  const padding = fontSize / 2;
  const x = canvas.width - textWidth - padding;
  const y = canvas.height - padding;
  
  // Add background for better visibility
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(
    x - padding / 2,
    y - fontSize - padding / 2,
    textWidth + padding,
    fontSize + padding
  );
  
  // Draw text
  ctx.fillStyle = 'white';
  ctx.fillText(watermarkText, x, y - padding / 2);
};

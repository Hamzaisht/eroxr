
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

// New helper function to generate video thumbnails with better error handling
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

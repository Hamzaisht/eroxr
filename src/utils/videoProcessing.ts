
/**
 * Validate if a file is a valid video format
 * @param file File to validate
 */
export async function validateVideoFormat(file: File): Promise<boolean> {
  if (!file) return false;

  const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];

  // Check MIME type
  if (!validVideoTypes.includes(file.type)) {
    console.warn(`Invalid video MIME type: ${file.type}`);
    return false;
  }

  // Check file size
  if (file.size === 0) {
    console.warn('Video file is empty');
    return false;
  }

  try {
    // Try to get video metadata as ultimate validation
    const duration = await getVideoDuration(file);
    return duration > 0;
  } catch (error) {
    console.error('Error validating video format:', error);
    return false;
  }
}

/**
 * Get video duration using URL.createObjectURL
 * @param file Video file
 */
export function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    // Create a temporary URL for the file
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    
    // Listen for metadata loaded event
    video.addEventListener('loadedmetadata', () => {
      // Clean up and resolve with duration
      URL.revokeObjectURL(url);
      resolve(video.duration);
    });
    
    // Listen for error events
    video.addEventListener('error', (e) => {
      URL.revokeObjectURL(url);
      reject(new Error(`Error loading video metadata: ${e}`));
    });
    
    // Set the source and attempt to load
    video.src = url;
    video.load();
    
    // Set a timeout in case the video doesn't load properly
    setTimeout(() => {
      URL.revokeObjectURL(url);
      reject(new Error('Timeout while loading video metadata'));
    }, 5000);
  });
}

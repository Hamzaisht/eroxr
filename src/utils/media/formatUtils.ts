
/**
 * Format file size to human-readable string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format duration in seconds to MM:SS
 */
export const formatDuration = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Format date to relative time (e.g. "2 days ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const pastDate = new Date(date);
  const diffMs = now.getTime() - pastDate.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) {
    return 'just now';
  } else if (diffMins < 60) {
    return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  } else {
    // Format as MM/DD/YYYY
    return pastDate.toLocaleDateString();
  }
};

/**
 * Format options for video display
 */
export const videoDisplayOptions = {
  playerOptions: {
    controls: true,
    autoplay: false,
    muted: false,
    loop: false,
    preload: 'auto',
    fluid: true,
  },
  transformOptions: {
    quality: 80,
    format: 'mp4'
  }
};

/**
 * Image transform options
 */
export const imageTransformOptions = {
  quality: 80,
  format: 'webp',
  resize: {
    width: 1200,
    height: 800,
    fit: 'inside'
  }
};

/**
 * Thumbnail transform options
 */
export const thumbnailTransformOptions = {
  quality: 70,
  format: 'webp',
  resize: {
    width: 300,
    height: 300,
    fit: 'cover'
  }
};

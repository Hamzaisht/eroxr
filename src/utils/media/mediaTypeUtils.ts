
/**
 * Determines the content type from a file or URL
 */
export const getContentType = (fileOrUrl: File | string): string => {
  // If it's a file, return its type
  if (typeof fileOrUrl !== 'string') {
    return fileOrUrl.type;
  }
  
  // If it's a URL, try to infer type from extension
  const url = fileOrUrl.toLowerCase();
  
  if (url.endsWith('.jpg') || url.endsWith('.jpeg')) {
    return 'image/jpeg';
  } else if (url.endsWith('.png')) {
    return 'image/png';
  } else if (url.endsWith('.gif')) {
    return 'image/gif';
  } else if (url.endsWith('.webp')) {
    return 'image/webp';
  } else if (url.endsWith('.svg')) {
    return 'image/svg+xml';
  } else if (url.endsWith('.mp4')) {
    return 'video/mp4';
  } else if (url.endsWith('.webm')) {
    return 'video/webm';
  } else if (url.endsWith('.mov') || url.endsWith('.qt')) {
    return 'video/quicktime';
  } else if (url.endsWith('.avi')) {
    return 'video/x-msvideo';
  } else if (url.endsWith('.mp3')) {
    return 'audio/mpeg';
  } else if (url.endsWith('.wav')) {
    return 'audio/wav';
  }
  
  return 'application/octet-stream'; // Default type
};

/**
 * Get file extension from a filename or URL
 */
export const getFileExtension = (fileNameOrUrl: string): string => {
  if (!fileNameOrUrl) return '';
  
  // Remove query parameters if present
  const cleanUrl = fileNameOrUrl.split('?')[0];
  
  // Get the extension
  const parts = cleanUrl.split('.');
  if (parts.length > 1) {
    return parts[parts.length - 1].toLowerCase();
  }
  
  return '';
};

/**
 * Determine if a file or URL is a video
 */
export const isVideo = (fileOrUrl: File | string): boolean => {
  const contentType = getContentType(fileOrUrl);
  return contentType.startsWith('video/');
};

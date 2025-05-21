
import { runFileDiagnostic, formatFileSize } from "./fileUtils";

// Define supported media types
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg', 
  'image/png', 
  'image/gif', 
  'image/webp', 
  'image/svg+xml'
];

export const SUPPORTED_VIDEO_TYPES = [
  'video/mp4', 
  'video/webm', 
  'video/quicktime', 
  'video/x-msvideo'
];

/**
 * Check if a file is an image
 */
export const isImageFile = (file: File): boolean => {
  return SUPPORTED_IMAGE_TYPES.includes(file.type.toLowerCase());
};

/**
 * Check if a file is a video
 */
export const isVideoFile = (file: File): boolean => {
  return SUPPORTED_VIDEO_TYPES.includes(file.type.toLowerCase());
};

/**
 * Get file extension from file or filename
 */
export const getFileExtension = (fileOrName: File | string): string => {
  const name = typeof fileOrName === 'string' ? fileOrName : fileOrName.name;
  return name.split('.').pop()?.toLowerCase() || '';
};

/**
 * Validates a file before upload with enhanced type and format checking
 */
export const validateFileForUpload = (
  file: File, 
  maxSizeInMB: number = 100
): { valid: boolean, error?: string, message?: string } => {
  // Run diagnostic first
  runFileDiagnostic(file);
  
  // Basic validation
  if (!file) {
    return { valid: false, error: "No file provided", message: "No file provided" };
  }
  
  if (!(file instanceof File)) {
    return { valid: false, error: "Invalid file object", message: "Invalid file object" };
  }
  
  if (file.size === 0) {
    return { valid: false, error: "File has zero size", message: "File has zero size" };
  }
  
  // Size validation
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    const errorMsg = `File exceeds maximum size (${formatFileSize(file.size)} > ${maxSizeInMB}MB)`;
    return { 
      valid: false, 
      error: errorMsg,
      message: errorMsg
    };
  }
  
  // Type validation for common formats
  const contentType = file.type.toLowerCase();
  
  // Images
  if (contentType.startsWith('image/')) {
    if (!SUPPORTED_IMAGE_TYPES.includes(contentType)) {
      const errorMsg = `Unsupported image format: ${contentType}. Use JPEG, PNG, GIF, WebP or SVG.`;
      return {
        valid: false,
        error: errorMsg,
        message: errorMsg
      };
    }
  }
  
  // Video
  else if (contentType.startsWith('video/')) {
    if (!SUPPORTED_VIDEO_TYPES.includes(contentType)) {
      const errorMsg = `Unsupported video format: ${contentType}. Use MP4, WebM, MOV or AVI.`;
      return {
        valid: false,
        error: errorMsg,
        message: errorMsg
      };
    }
  }
  
  // Audio
  else if (contentType.startsWith('audio/')) {
    const allowedAudioTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg'];
    if (!allowedAudioTypes.includes(contentType)) {
      const errorMsg = `Unsupported audio format: ${contentType}. Use MP3, WAV or OGG.`;
      return {
        valid: false,
        error: errorMsg,
        message: errorMsg
      };
    }
  }
  
  return { valid: true };
};

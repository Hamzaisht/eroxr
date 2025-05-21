
import { runFileDiagnostic, formatFileSize } from "./fileUtils";

/**
 * Validates a file before upload with enhanced type and format checking
 */
export const validateFileForUpload = (
  file: File, 
  maxSizeInMB: number = 100
): { valid: boolean, error?: string } => {
  // Run diagnostic first
  runFileDiagnostic(file);
  
  // Basic validation
  if (!file) {
    return { valid: false, error: "No file provided" };
  }
  
  if (!(file instanceof File)) {
    return { valid: false, error: "Invalid file object" };
  }
  
  if (file.size === 0) {
    return { valid: false, error: "File has zero size" };
  }
  
  // Size validation
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return { 
      valid: false, 
      error: `File exceeds maximum size (${formatFileSize(file.size)} > ${maxSizeInMB}MB)` 
    };
  }
  
  // Type validation for common formats
  const contentType = file.type.toLowerCase();
  
  // Images
  if (contentType.startsWith('image/')) {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedImageTypes.includes(contentType)) {
      return {
        valid: false,
        error: `Unsupported image format: ${contentType}. Use JPEG, PNG, GIF, WebP or SVG.`
      };
    }
  }
  
  // Video
  else if (contentType.startsWith('video/')) {
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    if (!allowedVideoTypes.includes(contentType)) {
      return {
        valid: false,
        error: `Unsupported video format: ${contentType}. Use MP4, WebM, MOV or AVI.`
      };
    }
  }
  
  // Audio
  else if (contentType.startsWith('audio/')) {
    const allowedAudioTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg'];
    if (!allowedAudioTypes.includes(contentType)) {
      return {
        valid: false,
        error: `Unsupported audio format: ${contentType}. Use MP3, WAV or OGG.`
      };
    }
  }
  
  return { valid: true };
};

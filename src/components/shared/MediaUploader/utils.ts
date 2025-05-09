
import { isImageFile, isVideoFile, SUPPORTED_IMAGE_TYPES, SUPPORTED_VIDEO_TYPES } from '@/utils/upload/validators';
import { runFileDiagnostic } from '@/utils/upload/fileUtils';

/**
 * Get allowed file types based on mediaTypes setting
 */
export const getAllowedTypes = (mediaTypes: 'image' | 'video' | 'both') => {
  if (mediaTypes === 'image') return SUPPORTED_IMAGE_TYPES;
  if (mediaTypes === 'video') return SUPPORTED_VIDEO_TYPES;
  return [...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_VIDEO_TYPES];
};

/**
 * Log file information for debugging
 */
export const logFileInfo = (file: File) => {
  console.log("FILE DEBUG >>>", {
    name: file.name,
    size: file.size,
    type: file.type,
    isBlob: file instanceof Blob,
    isFile: file instanceof File,
    preview: URL.createObjectURL(file)
  });
};

/**
 * Validate file before processing
 */
export const validateFile = (file: File | null) => {
  // CRITICAL: Strict file validation
  if (!file || !(file instanceof File)) {
    console.error("❌ Invalid file object:", file);
    return { valid: false, error: "Invalid file object" };
  }
  
  if (file.size === 0) {
    console.error("❌ File has zero size:", file.name);
    return { valid: false, error: "File is empty (0 bytes)" };
  }
  
  // Validate file type
  const isValidType = file.type.startsWith("image/") || file.type.startsWith("video/");
  if (!isValidType) {
    console.error("❌ Invalid file type:", file.type);
    return { valid: false, error: `Invalid file type: ${file.type}. Only images and videos are allowed.` };
  }
  
  // Run diagnostic on the file
  runFileDiagnostic(file);
  
  return { valid: true, error: null };
};

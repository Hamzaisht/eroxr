
import { SUPPORTED_IMAGE_TYPES, SUPPORTED_VIDEO_TYPES } from '@/utils/upload/validators';

/**
 * Get allowed file types based on mediaTypes setting
 */
export const getAllowedTypes = (mediaTypes: 'image' | 'video' | 'both'): string[] => {
  switch (mediaTypes) {
    case 'image':
      return SUPPORTED_IMAGE_TYPES;
    case 'video':
      return SUPPORTED_VIDEO_TYPES;
    case 'both':
    default:
      return [...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_VIDEO_TYPES];
  }
};

/**
 * Validate a file for upload
 */
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  if (!file || !(file instanceof File)) {
    return { valid: false, error: "Invalid file object" };
  }
  
  if (file.size === 0) {
    return { valid: false, error: "File is empty" };
  }
  
  return { valid: true };
};

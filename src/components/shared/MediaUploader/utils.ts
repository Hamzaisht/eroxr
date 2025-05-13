
import { SUPPORTED_IMAGE_TYPES, SUPPORTED_VIDEO_TYPES } from '@/utils/upload/validators';

/**
 * Get allowed file types based on mediaTypes option
 */
export const getAllowedTypes = (mediaTypes: 'image' | 'video' | 'both'): string[] => {
  if (mediaTypes === 'image') {
    return SUPPORTED_IMAGE_TYPES;
  }
  if (mediaTypes === 'video') {
    return SUPPORTED_VIDEO_TYPES;
  }
  return [...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_VIDEO_TYPES];
};

/**
 * Validate file before processing (quick check before passing to upload logic)
 */
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }
  
  if (!(file instanceof File)) {
    return { valid: false, error: 'Invalid file object' };
  }
  
  if (file.size === 0) {
    return { valid: false, error: `File "${file.name}" is empty (0 bytes)` };
  }
  
  return { valid: true };
};

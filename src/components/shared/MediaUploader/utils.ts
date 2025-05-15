
import { MediaTypes } from './types';
import { SUPPORTED_IMAGE_TYPES, SUPPORTED_VIDEO_TYPES } from '@/utils/upload/validators';

export const getAllowedTypes = (mediaTypes: MediaTypes | string): string[] => {
  if (typeof mediaTypes === 'string') {
    switch (mediaTypes) {
      case 'image':
        return SUPPORTED_IMAGE_TYPES;
      case 'video':
        return SUPPORTED_VIDEO_TYPES;
      case 'both':
      default:
        return [...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_VIDEO_TYPES];
    }
  }
  
  switch (mediaTypes) {
    case MediaTypes.IMAGE:
      return SUPPORTED_IMAGE_TYPES;
    case MediaTypes.VIDEO:
      return SUPPORTED_VIDEO_TYPES;
    case MediaTypes.ALL:
    default:
      return [...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_VIDEO_TYPES];
  }
};

export const validateFile = (file: File): { valid: boolean; error?: string } => {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }
  
  if (!(file instanceof File)) {
    return { valid: false, error: 'Invalid file object' };
  }
  
  if (file.size === 0) {
    return { valid: false, error: 'File is empty' };
  }
  
  return { valid: true };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

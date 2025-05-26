
import { UploadOptions, UploadResult, MediaAccessLevel } from '@/types/media';

/**
 * Default upload options
 */
export const defaultUploadOptions: UploadOptions = {
  maxSizeMB: 50,
  accessLevel: MediaAccessLevel.PUBLIC,
  bucket: 'media'
};

/**
 * Validates upload options
 */
export const validateUploadOptions = (options: UploadOptions): boolean => {
  if (options.maxSizeMB && options.maxSizeMB <= 0) {
    return false;
  }
  
  return true;
};

/**
 * Creates a successful upload result
 */
export const createSuccessResult = (url: string): UploadResult => {
  return {
    success: true,
    url
  };
};

/**
 * Creates a failed upload result
 */
export const createErrorResult = (error: string): UploadResult => {
  return {
    success: false,
    error
  };
};

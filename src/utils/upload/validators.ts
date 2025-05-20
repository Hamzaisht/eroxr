
/**
 * Validator functions for file uploads
 */

import { MediaType } from '@/types/media';

// Supported media types constants
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp'
];

export const SUPPORTED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime'
];

// Validate file for upload
export const validateFileForUpload = (file: File, maxSizeInMB = 100): { valid: boolean, error?: string } => {
  // Check if file exists
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }
  
  // Check if it's a valid File object
  if (!(file instanceof File)) {
    return { valid: false, error: 'Invalid file object' };
  }
  
  // Check size
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return { valid: false, error: `File size exceeds the maximum allowed size (${maxSizeInMB}MB)` };
  }
  
  // Check if it's an allowed file type (can be expanded)
  if (!isImageFile(file) && !isVideoFile(file)) {
    return { valid: false, error: `Unsupported file type: ${file.type}` };
  }
  
  return { valid: true };
};

// Check if file is an image
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

// Check if file is a video
export const isVideoFile = (file: File): boolean => {
  return file.type.startsWith('video/');
};

// Get file extension
export const getFileExtension = (file: File | string): string => {
  const filename = typeof file === 'string' ? file : file.name;
  return filename.split('.').pop()?.toLowerCase() || '';
};

/**
 * Run a comprehensive diagnostic on a file object
 * This helps identify issues with file objects that may cause upload failures
 */
export const runFileDiagnostic = (file: File): { valid: boolean, error?: string } => {
  if (!file) {
    console.warn('FILE DIAGNOSTIC: File is null or undefined');
    return { valid: false, error: 'File is null or undefined' };
  }
  
  if (!(file instanceof File)) {
    console.warn('FILE DIAGNOSTIC: Not a File instance');
    return { valid: false, error: 'Not a valid File instance' };
  }
  
  if (file.size === 0) {
    console.warn('FILE DIAGNOSTIC: File has zero size');
    return { valid: false, error: 'File has zero size' };
  }
  
  // Log diagnostic info for debugging
  console.log('FILE DIAGNOSTIC:', {
    isFile: file instanceof File,
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: new Date(file.lastModified).toISOString()
  });
  
  return { valid: true };
};

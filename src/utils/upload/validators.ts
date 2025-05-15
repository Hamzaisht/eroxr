
// Supported file types
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

/**
 * Validates a file for upload
 * @param file The file to validate
 * @param maxSizeInMB Maximum file size in MB
 * @returns Result of validation
 */
export const validateFileForUpload = (
  file: File,
  maxSizeInMB = 100
): { valid: boolean; error?: string } => {
  // Check if file is valid
  if (!file || !(file instanceof File)) {
    return { valid: false, error: "Invalid file object" };
  }

  // Check file size
  const maxSizeBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File is too large. Maximum size is ${maxSizeInMB}MB`
    };
  }

  // Check if file is empty
  if (file.size === 0) {
    return { valid: false, error: "File is empty" };
  }

  return { valid: true };
};

/**
 * Check if a file is an image
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * Check if a file is a video
 */
export const isVideoFile = (file: File): boolean => {
  return file.type.startsWith('video/');
};

/**
 * Get file extension from File object
 */
export const getFileExtension = (file: File): string => {
  return file.name.split('.').pop()?.toLowerCase() || '';
};

/**
 * Runs a diagnostic on a file to debug upload issues
 * @param file The file to diagnose
 */
export const runFileDiagnostic = (file: any): void => {
  console.log("FILE DIAGNOSTIC:", {
    value: file,
    type: typeof file,
    isFile: file instanceof File,
    constructor: file && file.constructor ? file.constructor.name : 'N/A',
    properties: file ? Object.keys(file) : [],
    fileType: file && file.type ? file.type : 'N/A',
    fileSize: file && file.size ? `${(file.size / 1024).toFixed(2)} KB` : 'N/A',
    fileName: file && file.name ? file.name : 'N/A',
    lastModified: file && file.lastModified ? new Date(file.lastModified).toLocaleString() : 'N/A',
  });
};

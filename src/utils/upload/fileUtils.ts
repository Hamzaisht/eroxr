
/**
 * Create a file preview URL
 * @param file - The file to create a preview for
 * @returns A blob URL for the file
 */
export const createFilePreview = (file: File): string => {
  if (!file) {
    throw new Error('Cannot create preview for null file');
  }
  
  return URL.createObjectURL(file);
};

/**
 * Revoke a file preview URL to free up memory
 * @param url - The URL to revoke
 */
export const revokeFilePreview = (url: string): void => {
  if (!url || !url.startsWith('blob:')) return;
  
  try {
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error revoking object URL:', error);
  }
};

/**
 * Check if a file is a valid image
 * @param file - The file to check
 * @returns true if the file is a valid image
 */
export const isValidImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * Check if a file is a valid video
 * @param file - The file to check
 * @returns true if the file is a valid video
 */
export const isValidVideoFile = (file: File): boolean => {
  return file.type.startsWith('video/');
};

/**
 * Convert a file to a base64 data URL
 * @param file - The file to convert
 * @returns A promise resolving to the base64 data URL
 */
export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result as string);
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Get the file extension from a file name
 * @param fileName - The file name
 * @returns The file extension (lowercase, without the dot)
 */
export const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop()?.toLowerCase() || '';
};

/**
 * Calculate the file size in human-readable format
 * @param bytes - The file size in bytes
 * @returns A human-readable size string (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};


/**
 * Create a preview URL for a file
 */
export const createFilePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Revoke a file preview URL to prevent memory leaks
 */
export const revokeFilePreview = (url: string): void => {
  URL.revokeObjectURL(url);
};

/**
 * Format file size to human-readable string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

/**
 * Create a unique file path for a user's file
 */
export const createUserFilePath = (userId: string, fileName: string): string => {
  return `${userId}/${Date.now()}_${fileName}`;
};

/**
 * Get appropriate bucket name for file type and context
 */
export const getBucketForFileType = (file: File, context?: string): string => {
  if (context) {
    switch (context) {
      case 'story':
        return 'stories';
      case 'post':
        return 'posts';
      case 'message':
        return 'messages';
      case 'profile':
      case 'avatar':
        return 'avatars';
      case 'short':
        return 'shorts';
      default:
        break;
    }
  }

  // If no context or unrecognized context, determine by file type
  if (file.type.startsWith('image/')) {
    return 'media';
  } else if (file.type.startsWith('video/')) {
    return 'shorts';
  } else {
    return 'media';
  }
};

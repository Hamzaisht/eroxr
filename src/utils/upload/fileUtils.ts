
/**
 * Run file diagnostics to check size, type, and potential issues
 */
export const runFileDiagnostic = (file: File): { valid: boolean; error?: string; details?: any } => {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  // Check file size (max 100MB)
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds the maximum limit of 100MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
      details: { size: file.size, maxSize }
    };
  }

  // Check file type
  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const validVideoTypes = ['video/mp4', 'video/quicktime', 'video/webm'];
  const validAudioTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg'];
  
  const isImage = validImageTypes.includes(file.type);
  const isVideo = validVideoTypes.includes(file.type);
  const isAudio = validAudioTypes.includes(file.type);
  
  if (!isImage && !isVideo && !isAudio) {
    return {
      valid: false,
      error: `Unsupported file type: ${file.type}. Please upload an image, video, or audio file.`,
      details: { type: file.type, supported: [...validImageTypes, ...validVideoTypes, ...validAudioTypes] }
    };
  }

  return { 
    valid: true,
    details: {
      size: file.size,
      type: file.type,
      isImage,
      isVideo,
      isAudio,
      name: file.name,
      lastModified: file.lastModified
    }
  };
};

/**
 * Create a file preview URL for displaying in the UI
 */
export const createFilePreview = (file: File): string => {
  if (!file) return '';
  return URL.createObjectURL(file);
};

/**
 * Revoke the file preview URL when it's no longer needed
 */
export const revokeFilePreview = (previewUrl: string): void => {
  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
  }
};


/**
 * Validate if a file is suitable for upload
 */
export function validateFileForUpload(file: File, maxSizeInMB: number = 100): {
  valid: boolean;
  error?: string;
} {
  // Check if file actually exists and is a File object
  if (!file || !(file instanceof File)) {
    return {
      valid: false,
      error: "No file selected or invalid file object"
    };
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
    return {
      valid: false,
      error: "File is empty"
    };
  }

  return { valid: true };
}

/**
 * Check if a file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Check if a file is a video
 */
export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/');
}

/**
 * Check if a file is an audio file
 */
export function isAudioFile(file: File): boolean {
  return file.type.startsWith('audio/');
}

/**
 * Run diagnostics on a file before upload
 */
export function runFileDiagnostic(file: File): void {
  if (!file) {
    console.error("NULL file passed to diagnostic");
    return;
  }
  
  console.log("[FILE DIAGNOSTIC]", {
    name: file.name,
    type: file.type,
    size: `${(file.size / 1024).toFixed(2)} KB`,
    lastModified: new Date(file.lastModified).toLocaleString(),
    isFile: file instanceof File,
    hasSize: file.size > 0
  });
}

/**
 * Get file extension from a filename or url
 */
export function getFileExtension(file: File | string): string {
  if (typeof file === 'string') {
    const parts = file.split('.');
    return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
  }
  
  return file.name.split('.').pop()?.toLowerCase() || '';
}

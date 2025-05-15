
interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Get file extension from File object
 */
export function getFileExtension(file: File): string {
  if (!file || !file.name) return '';
  const parts = file.name.split('.');
  return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
}

/**
 * Check if file is an image
 */
export function isImageFile(file: File): boolean {
  if (!file || !file.type) return false;
  return file.type.startsWith('image/');
}

/**
 * Check if file is a video
 */
export function isVideoFile(file: File): boolean {
  if (!file || !file.type) return false;
  return file.type.startsWith('video/');
}

/**
 * Check if file is an audio file
 */
export function isAudioFile(file: File): boolean {
  if (!file || !file.type) return false;
  return file.type.startsWith('audio/');
}

/**
 * Validate a file for upload
 */
export function validateFileForUpload(file: File, maxSizeMB = 100): ValidationResult {
  // Check if file is valid
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { 
      valid: false, 
      error: `File size exceeds maximum allowed size (${maxSizeMB}MB)` 
    };
  }

  // Check if file type is allowed
  const allowedTypes = [
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    // Videos
    'video/mp4',
    'video/webm',
    'video/quicktime',
    // Audio
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type "${file.type}" is not allowed`
    };
  }

  return { valid: true };
}

/**
 * Run diagnostic checks on a file and log results
 */
export function runFileDiagnostic(file: File | null): void {
  if (!file) {
    console.error("❌ File diagnostic: Null file object");
    return;
  }
  
  if (!(file instanceof File)) {
    console.error("❌ File diagnostic: Object is not a File instance", typeof file);
    return;
  }
  
  console.log("📝 File diagnostic:", {
    name: file.name,
    size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    type: file.type || "No type",
    lastModified: new Date(file.lastModified).toLocaleString()
  });
  
  if (file.size === 0) {
    console.error("⚠️ File diagnostic: Zero-byte file detected");
  }
  
  if (isImageFile(file)) {
    console.log("🖼️ File diagnostic: Image file detected");
  } else if (isVideoFile(file)) {
    console.log("🎬 File diagnostic: Video file detected");
  } else if (isAudioFile(file)) {
    console.log("🔊 File diagnostic: Audio file detected");
  } else {
    console.log("📄 File diagnostic: Other file type detected");
  }
}

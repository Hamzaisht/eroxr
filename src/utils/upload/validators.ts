
// Supported image MIME types
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml'
];

// Supported video MIME types
export const SUPPORTED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime' // .mov files
];

// Supported audio MIME types
export const SUPPORTED_AUDIO_TYPES = [
  'audio/mpeg', // .mp3
  'audio/ogg',
  'audio/wav',
  'audio/webm',
  'audio/aac'
];

// Supported document MIME types
export const SUPPORTED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.ms-excel', // .xls
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-powerpoint', // .ppt
  'application/vnd.openxmlformats-officedocument.presentationml.presentation' // .pptx
];

// Helper functions to check file types
export function isImageFile(file: File): boolean {
  return SUPPORTED_IMAGE_TYPES.includes(file.type);
}

export function isVideoFile(file: File): boolean {
  return SUPPORTED_VIDEO_TYPES.includes(file.type);
}

export function isAudioFile(file: File): boolean {
  return SUPPORTED_AUDIO_TYPES.includes(file.type);
}

export function isDocumentFile(file: File): boolean {
  return SUPPORTED_DOCUMENT_TYPES.includes(file.type);
}

// Validate file size (in MB)
export function validateFileSize(file: File, maxSizeInMB: number = 10): boolean {
  const fileSizeInMB = file.size / (1024 * 1024);
  return fileSizeInMB <= maxSizeInMB;
}

// Exported validation function that returns a detailed result
export function validateFile(
  file: File, 
  options: {
    maxSizeInMB?: number;
    allowedTypes?: string[];
  } = {}
): { valid: boolean; error?: string } {
  const { maxSizeInMB = 10, allowedTypes = [...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_VIDEO_TYPES] } = options;

  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file type: ${file.type}. Allowed types: ${allowedTypes.join(', ')}`
    };
  }

  // Check file size
  if (!validateFileSize(file, maxSizeInMB)) {
    return {
      valid: false,
      error: `File is too large. Maximum size is ${maxSizeInMB}MB.`
    };
  }

  // All checks passed
  return { valid: true };
}

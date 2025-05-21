
// Export validator functions with explicit named exports to avoid ambiguity
export {
  validateFileForUpload,
  isImageFile,
  isVideoFile,
  isAudioFile,
  isDocumentFile,
  getFileExtension,
  SUPPORTED_IMAGE_TYPES,
  SUPPORTED_VIDEO_TYPES,
  SUPPORTED_AUDIO_TYPES,
  SUPPORTED_DOCUMENT_TYPES
} from './validators';

// Export file utilities
export {
  runFileDiagnostic,
  formatFileSize,
  createFilePreview,
  revokeFilePreview,
  createUniqueFilePath,
  createUserFilePath,
  addCacheBuster,
  extractFileExtension,
  getMimeTypeFromExtension,
  inferContentTypeFromExtension
} from './fileUtils';

// Export storage service
export * from './storageService';

// Export file upload service
export * from './fileUploadService';

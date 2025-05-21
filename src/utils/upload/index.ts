
// Export validator functions with explicit named exports to avoid ambiguity
export {
  validateFileForUpload,
  isImageFile,
  isVideoFile,
  getFileExtension,
  SUPPORTED_IMAGE_TYPES,
  SUPPORTED_VIDEO_TYPES
} from './validators';

// Export file utilities
export {
  runFileDiagnostic,
  formatFileSize,
  createFilePreview,
  revokeFilePreview,
  createUniqueFilePath
} from './fileUtils';

// Export storage service
export * from './storageService';

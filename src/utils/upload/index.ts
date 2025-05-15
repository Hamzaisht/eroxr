
// Export validator functions with explicit named exports to avoid ambiguity
export {
  validateFileForUpload,
  isImageFile,
  isVideoFile,
  getFileExtension,
  runFileDiagnostic,
  SUPPORTED_IMAGE_TYPES,
  SUPPORTED_VIDEO_TYPES
} from './validators';

// Export file utilities
export * from './fileUtils';

// Export storage service
export * from './storageService';

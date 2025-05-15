
// Export validator functions with explicit named exports to avoid ambiguity
export {
  validateFileForUpload,
  isImageFile,
  isVideoFile,
  getFileExtension,
  runFileDiagnostic
} from './validators';

// Export file utilities
export * from './fileUtils';

// Export storage service
export * from './storageService';

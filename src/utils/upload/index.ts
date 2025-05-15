
// Re-export all upload utilities
export * from './storageService';
export * from './fileUtils';
// Explicitly re-export from validators to avoid ambiguity
export { 
  validateFileForUpload, 
  isImageFile, 
  isVideoFile, 
  isAudioFile, 
  runFileDiagnostic 
} from './validators';

// Only export getFileExtension from mediaUtils to avoid ambiguity
export { uploadFileToStorage } from '../media/mediaUtils';

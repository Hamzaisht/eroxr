
// Re-export all media utilities from the various files
export * from './types';
export * from './mediaUtils';
export * from './mediaTypeUtils';

// Explicitly re-export these items to resolve ambiguity and ensure they're available
export { MediaType } from './types';
export { 
  detectMediaType, 
  determineMediaType,
  extractMediaUrl, 
  createUniqueFilePath,
  normalizeMediaSource,
  uploadFileToStorage
} from './mediaUtils';
export { 
  isImageType, 
  isVideoType, 
  isAudioType, 
  mimeTypeToMediaType 
} from './mediaTypeUtils';


// Re-export all media utilities from the various files
export * from './types';
export * from './mediaUtils';
export * from './mediaTypeUtils';
export * from './urlUtils';
export * from './generateVideoThumbnail';
export * from './mediaOrchestrator';

// Explicitly re-export these items to resolve ambiguity and ensure they're available
export { MediaType } from './types';
export { 
  detectMediaType, 
  extractMediaUrl, 
  createUniqueFilePath,
  normalizeMediaSource,
  uploadFileToStorage,
  isValidMediaUrl
} from './mediaUtils';
export { 
  isImageType, 
  isVideoType, 
  isAudioType,
  mimeTypeToMediaType
} from './mediaTypeUtils';
export {
  isVideoUrl,
  isImageUrl,
  isAudioUrl,
  isValidUrl,
  getPlayableMediaUrl,
  getOptimizedImageUrl
} from './urlUtils';
export {
  generateVideoThumbnail,
  generateThumbnailFromUrl
} from './generateVideoThumbnail';

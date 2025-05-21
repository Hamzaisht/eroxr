
// Re-export all media utilities from the various files
export * from './types';
export * from './mediaUtils';
export * from './mediaTypeUtils';
export * from './urlUtils';
export * from './generateVideoThumbnail';
export * from './mediaOrchestrator';
export * from './uploadUtils';

// Explicit re-exports to ensure compatibility
export { 
  MediaType, 
  MediaAccessLevel,
  AvailabilityStatus,
  MediaSource, 
  MediaOptions,
  UploadOptions,
  UploadResult 
} from './types';

export { 
  determineMediaType,
  detectMediaType, 
  extractMediaUrl, 
  createUniqueFilePath,
  normalizeMediaSource,
  uploadFileToStorage,
  calculateAspectRatioDimensions,
  getPlayableMediaUrl,
  formatFileSize
} from './mediaUtils';

export { 
  isImageType, 
  isVideoType, 
  isAudioType,
  isDocumentType,
  mimeTypeToMediaType,
  getFileExtension,
  isValidMediaUrl as isValidUrl
} from './mediaTypeUtils';

export {
  isVideoUrl,
  isImageUrl,
  isAudioUrl,
  isValidUrl,
  getPlayableMediaUrl as getMediaUrl,
  getOptimizedImageUrl
} from './urlUtils';

export {
  generateVideoThumbnail,
  generateThumbnailFromUrl
} from './generateVideoThumbnail';

export {
  isValidMediaUrl
} from './mediaOrchestrator';

export {
  uploadMediaToSupabase,
  deleteMediaFromSupabase
} from './uploadUtils';

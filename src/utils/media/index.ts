
// Re-export all media utilities from the various files
export * from './mediaUtils';
export * from './mediaTypeUtils';
export * from './urlUtils';
export * from './generateVideoThumbnail';
export * from './mediaOrchestrator';
export * from './uploadUtils';

// Explicit type re-exports with proper 'export type' syntax
export type { 
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
  extractMediaUrl, 
  normalizeMediaSource,
  uploadFileToStorage,
  calculateAspectRatioDimensions,
  getPlayableMediaUrl,
  formatFileSize,
  createUniqueFilePath
} from './mediaUtils';

export { 
  isImageType, 
  isVideoType, 
  isAudioType,
  isDocumentType,
  getFileExtension,
  mimeTypeToMediaType
} from './mediaTypeUtils';

export {
  isVideoUrl,
  isImageUrl,
  isAudioUrl,
  // Rename this export to avoid the duplicate
  isValidUrl as isValidMediaUrl,
  getOptimizedImageUrl
} from './urlUtils';

export {
  generateVideoThumbnail,
  generateThumbnailFromUrl
} from './generateVideoThumbnail';

// Export validateMediaUrl and isValidMediaUrl from mediaOrchestrator
export {
  validateMediaUrl,
  isValidMediaUrl
} from './mediaOrchestrator';

export {
  uploadMediaToSupabase,
  deleteMediaFromSupabase
} from './uploadUtils';

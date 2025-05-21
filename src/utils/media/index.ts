
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

// Export functions from mediaUtils
export { 
  normalizeMediaSource,
  extractMediaUrl,
  calculateAspectRatioDimensions,
  determineMediaType,
  createUniqueFilePath,
  formatFileSize,
  uploadFileToStorage,
  getPlayableMediaUrl,
  addCacheBuster
} from './mediaUtils';

// Export functions from mediaTypeUtils
export { 
  isImageType, 
  isVideoType, 
  isAudioType,
  isDocumentType,
  getMediaTypeFromFile
} from './mediaTypeUtils';

// Export functions from urlUtils
export {
  isVideoUrl,
  isImageUrl,
  isAudioUrl,
  isValidUrl,
  getOptimizedImageUrl
} from './urlUtils';

// Export functions from generateVideoThumbnail
export {
  generateVideoThumbnail,
  generateThumbnailFromUrl
} from './generateVideoThumbnail';

// Export functions from mediaOrchestrator
export {
  isValidMediaUrl,
  validateMediaUrl,
  canAccessMedia
} from './mediaOrchestrator';

// Export functions from uploadUtils
export {
  uploadMediaToSupabase,
  deleteMediaFromSupabase
} from './uploadUtils';

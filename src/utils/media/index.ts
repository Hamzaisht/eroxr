
// Re-export all media utilities from the various files
export * from './mediaTypeUtils';
export * from './urlUtils';
export * from './uploadUtils';

// Export specific functions from mediaUtils to avoid conflicts
export { 
  determineMediaType, 
  extractMediaUrl, 
  normalizeMediaSource 
} from './mediaUtils';

// Export specific functions from dimensionUtils
export { 
  calculateAspectRatioDimensions,
  getResponsiveDimensions 
} from './dimensionUtils';

// Export specific functions from fileUtils  
export { 
  createUniqueFilePath,
  getFileExtension,
  isValidMediaFile 
} from './fileUtils';

// Export mediaSourceUtils
export * from './mediaSourceUtils';

// Explicit type re-exports with proper 'export type' syntax
export type { 
  MediaType, 
  MediaAccessLevel,
  AvailabilityStatus,
  MediaSource, 
  MediaOptions,
  UploadOptions,
  UploadResult 
} from '@/types/media';

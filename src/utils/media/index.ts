
// Re-export core media utilities
export * from './coreMediaUtils';
export * from './urlUtils';

// Export specific functions from mediaUtils to avoid conflicts
export { 
  determineMediaType as determineMediaTypeFromExtension, 
  extractMediaUrl as extractUrlFromSource, 
  normalizeMediaSource,
  calculateAspectRatioDimensions,
  createUniqueFilePath
} from './mediaUtils';

// Export specific functions from uploadUtils
export { 
  uploadMediaToSupabase,
  defaultUploadOptions,
  validateUploadOptions,
  createSuccessResult,
  createErrorResult
} from './uploadUtils';

// Export specific functions from dimensionUtils if it exists
export { 
  getResponsiveDimensions 
} from './dimensionUtils';

// Export specific functions from fileUtils  
export { 
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

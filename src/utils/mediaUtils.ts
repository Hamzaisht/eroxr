
// Re-export everything from our new modular media utilities
export * from './media/types';
export * from './media/urlUtils';
export * from './media/formatUtils';

// Selectively re-export specific functions to avoid duplicates
export { 
  createUniqueFilePath, 
  uploadFileToStorage 
} from './media/mediaUtils';

export { 
  getPlayableMediaUrl, 
  ensureFullUrl, 
  addCacheBuster 
} from './media/urlUtils';

export {
  inferContentTypeFromExtension
} from './media/formatUtils';

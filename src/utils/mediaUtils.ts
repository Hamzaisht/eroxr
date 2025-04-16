
/**
 * This file provides backward compatibility for code still importing from @/utils/mediaUtils
 * It re-exports everything from our new modular media utilities
 */

// Export everything from our new modular media utilities
export * from './media/mediaUtils';
export * from './media/types';
export * from './media/urlUtils';
export * from './media/formatUtils';

// Export key functions for backward compatibility but avoid duplicate exports
export { 
  createUniqueFilePath
} from './media/mediaUtils';
export { 
  getPlayableMediaUrl, 
  ensureFullUrl, 
  addCacheBuster 
} from './media/urlUtils';
export {
  inferContentTypeFromExtension
} from './media/formatUtils';

// Re-export these explicitly to avoid ambiguity
import { uploadFileToStorage, getStorageUrl } from './media/mediaUtils';
export { uploadFileToStorage, getStorageUrl };

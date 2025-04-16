
// Re-export everything from our new modular media utilities
export * from './media/mediaUtils';
export * from './media/types';
export * from './media/urlUtils';
export * from './media/formatUtils';

// Avoid re-exporting `UploadResult` to prevent type conflict
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

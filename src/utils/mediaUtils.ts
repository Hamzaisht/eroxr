
// Re-export everything from our modular media utilities
export * from './media/types';
export * from './media/mediaUtils';
export * from './media/formatUtils';

// Export from urlUtils with explicit naming to avoid conflicts
import { getFileExtension, getPlayableMediaUrl, addCacheBuster, getAbsoluteUrl as toAbsoluteUrl } from './media/urlUtils';
export { getFileExtension, getPlayableMediaUrl, addCacheBuster, toAbsoluteUrl };
// Re-export the original function with a different name to avoid conflicts
export const getExtensionFromFile = getFileExtension;

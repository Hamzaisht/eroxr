
// Re-export from the new structured files for backward compatibility
export { 
  uploadFile as uploadFileToStorage,
  addCacheBuster as getUrlWithCacheBuster,
  getPublicUrl
} from './upload/storageService';

export {
  getContentType,
  isVideo as getMediaType,
  getFileExtension,
} from './media/mediaTypeUtils';

export {
  createUserFilePath as createUniqueFilePath,
  generateUniqueFileName, 
  formatFileSize,
  createFilePreview,
  revokeFilePreview,
  getBucketForFileType 
} from './upload/fileUtils';

export { validateMediaFile, isImageFile, isVideoFile } from './upload/validators';

// Helper function to refresh URLs with cache busting
export const refreshUrl = (url: string): string => {
  if (!url) return '';
  const timestamp = Date.now();
  return url.includes('?') 
    ? `${url}&t=${timestamp}` 
    : `${url}?t=${timestamp}`;
};

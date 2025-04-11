
// Re-export from the new structured files for backward compatibility
export { 
  uploadFile as uploadFileToStorage,
  addCacheBuster as getUrlWithCacheBuster,
  getPublicUrl
} from './upload/storageService';

export {
  createUniqueFilePath,
  getContentType,
  getMediaType,
  refreshUrl
} from './media/mediaTypeUtils';

export {
  createUserFilePath,
  generateUniqueFileName, 
  formatFileSize,
  createFilePreview,
  revokeFilePreview,
  getBucketForFileType 
} from './upload/fileUtils';

export { validateMediaFile, isImageFile, isVideoFile } from './upload/validators';

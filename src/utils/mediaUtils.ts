
// Re-export from the new structured files for backward compatibility
export { 
  uploadFile as uploadFileToStorage,
  addCacheBuster as getUrlWithCacheBuster,
  getPublicUrl,
  updateFileMetadata,
  type UploadOptions,
  type UploadResult
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

export { 
  validateMediaFile, 
  isImageFile, 
  isVideoFile,
  SUPPORTED_IMAGE_TYPES,
  SUPPORTED_VIDEO_TYPES
} from './upload/validators';

export {
  addCacheBuster as refreshUrl, // Keep only this refreshUrl export
  checkUrlContentType,
  inferContentTypeFromUrl,
  fixUrlContentType,
  checkUrlAccessibility
} from './media/urlUtils';


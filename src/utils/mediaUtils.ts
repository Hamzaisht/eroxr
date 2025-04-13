
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
  addCacheBuster as refreshUrl,
  checkUrlContentType,
  inferContentTypeFromUrl,
  fixUrlContentType,
  checkUrlAccessibility
} from './media/urlUtils';

// Legacy helper function to refresh URLs with cache busting
export const refreshUrl = (url: string): string => {
  if (!url) return '';
  const timestamp = Date.now();
  return url.includes('?') 
    ? `${url}&t=${timestamp}` 
    : `${url}?t=${timestamp}`;
};

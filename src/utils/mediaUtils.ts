
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
  createUserFilePath, 
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

// Export from urlUtils but rename to avoid conflict with the legacy name
export {
  addCacheBuster, // Export without renaming to avoid conflicts
  checkUrlContentType,
  inferContentTypeFromUrl,
  fixUrlContentType,
  checkUrlAccessibility
} from './media/urlUtils';

// Create a utility function to avoid conflicts with other exports
export const refreshMediaUrl = (url: string): string => {
  if (!url) return '';
  const timestamp = Date.now();
  return url.includes('?') 
    ? `${url}&t=${timestamp}` 
    : `${url}?t=${timestamp}`;
};

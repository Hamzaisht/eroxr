
// Re-export functions from nested modules
export { 
  uploadFileToStorage, 
  createUniqueFilePath, 
  getFileFromStorage, 
  deleteFileFromStorage,
  determineMediaType,
  extractMediaUrl,
  optimizeImage,
  createVideoThumbnail
} from './media/mediaUtils';

// Ensure we export getPlayableMediaUrl correctly
export { getPlayableMediaUrl } from './media/urlUtils';


// Re-export functions from nested modules
export { 
  uploadFileToStorage, 
  createUniqueFilePath, 
  getFileFromStorage, 
  deleteFileFromStorage,
  determineMediaType,
  extractMediaUrl
} from './media/mediaUtils';

// Only export this from one place to avoid conflicts
// Remove the duplicate export
// export { inferContentTypeFromExtension } from './media/mediaUtils';

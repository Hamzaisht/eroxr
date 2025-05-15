
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a unique file path for a user's uploaded file
 * @param userId The ID of the user uploading the file
 * @param file The file being uploaded
 * @returns A unique file path
 */
export const createUniqueFilePath = (userId: string, file: File): string => {
  // Extract the file extension
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
  
  // Create a unique ID for the file
  const uniqueId = uuidv4();
  
  // Get the file type prefix (for organization)
  const typePrefix = file.type.startsWith('image/') 
    ? 'images' 
    : file.type.startsWith('video/') 
      ? 'videos' 
      : 'files';
  
  // Create a path with the format: {typePrefix}/{userId}/{uniqueId}.{extension}
  return `${typePrefix}/${userId}/${uniqueId}.${fileExtension}`;
};


/**
 * Runs diagnostics on a file to log information useful for debugging
 * @param file The file to analyze
 */
export const runFileDiagnostic = (file: File): void => {
  console.log('File diagnostic:', {
    name: file.name,
    type: file.type,
    size: file.size,
    lastModified: new Date(file.lastModified).toISOString(),
    isFile: file instanceof File,
    isBlob: file instanceof Blob,
  });
};

/**
 * Creates a unique file path for storage
 * @param userId User's ID
 * @param file The file being uploaded
 * @returns A unique storage path
 */
export const createUniqueFilePath = (userId: string, file: File): string => {
  // Generate a unique timestamp-based ID
  const timestamp = Date.now();
  const randomChars = Math.random().toString(36).substring(2, 8);
  const uniqueId = `${timestamp}-${randomChars}`;
  
  // Get file extension
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
  
  // Determine folder based on content type
  let folder = 'files';
  if (file.type.startsWith('image/')) folder = 'images';
  else if (file.type.startsWith('video/')) folder = 'videos';
  else if (file.type.startsWith('audio/')) folder = 'audio';
  
  // Create a clean structure: folder/userId/uniqueId.extension
  return `${folder}/${userId}/${uniqueId}.${fileExtension}`;
};

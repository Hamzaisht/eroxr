
/**
 * Creates a unique file path for storage based on user ID and file
 */
export const createUniqueFilePath = (userId: string, file: File | string): string => {
  const timestamp = Date.now();
  let fileExt = 'jpg'; // Default extension
  
  if (typeof file === 'object' && file instanceof File) {
    fileExt = file.name.split('.').pop() || 'jpg';
  } else if (typeof file === 'string') {
    // Try to extract extension from string (URL or base64)
    const matches = file.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
    if (matches && matches[1]) {
      fileExt = matches[1];
    }
  }
  
  return `${userId}/${timestamp}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
};

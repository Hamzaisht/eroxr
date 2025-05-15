
/**
 * Create a blob URL from a File object
 */
export const createBlobUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Revoke a blob URL to prevent memory leaks
 */
export const revokeBlobUrl = (url: string): void => {
  URL.revokeObjectURL(url);
};

/**
 * Generate a secure file path for uploading
 */
export const generateSecureFilePath = (
  userId: string,
  fileType: string,
  fileName: string
): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  const extension = fileName.split('.').pop();
  
  return `${fileType}/${userId}/${timestamp}-${randomString}.${extension}`;
};

/**
 * Convert a base64 string to a File object
 */
export const base64ToFile = (
  base64: string,
  fileName: string,
  options: { type?: string; lastModified?: number } = {}
): File => {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || options.type || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], fileName, {
    type: mime,
    lastModified: options.lastModified || Date.now()
  });
};

/**
 * Convert a File object to base64
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

/**
 * Create a download link for a file
 */
export const createDownloadLink = (url: string, fileName: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Extract filename from a URL
 */
export const getFileNameFromUrl = (url: string): string => {
  return url.substring(url.lastIndexOf('/') + 1);
};

/**
 * Check if a URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

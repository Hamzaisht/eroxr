
/**
 * Adds cache busting parameters to a URL
 */
export const addCacheBuster = (url: string): string => {
  if (!url) return url;
  
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return url.includes('?') 
    ? `${url}&t=${timestamp}&r=${random}` 
    : `${url}?t=${timestamp}&r=${random}`;
};

/**
 * Gets a public URL for a file in Supabase storage
 */
export const getFullPublicUrl = (bucket: string, path: string): string => {
  if (!path) return '';
  
  // This is a stub function - the actual implementation will be in useStorageService
  return '';
};

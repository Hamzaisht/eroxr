
/**
 * Add cache busting parameter to URL to prevent browser caching
 */
export const addCacheBuster = (url: string): string => {
  if (!url) return '';
  
  // Prevent recursive cache busting by checking for existing timestamp
  if (url.includes('t=') && url.includes('&r=')) {
    return url;
  }
  
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  
  return url.includes('?') 
    ? `${url}&t=${timestamp}&r=${random}` 
    : `${url}?t=${timestamp}&r=${random}`;
};

/**
 * Check content type of a remote URL
 */
export const checkUrlContentType = async (url: string): Promise<string | null> => {
  try {
    // First try with HEAD request which is more efficient
    const response = await fetch(url, { method: 'HEAD', cache: 'no-store' });
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType) {
        return contentType;
      }
    }
    
    // If HEAD failed or no content-type, try with a small range GET request
    const rangeResponse = await fetch(url, { 
      headers: { Range: 'bytes=0-1024' },
      cache: 'no-store'
    });
    
    if (rangeResponse.ok || rangeResponse.status === 206) {
      const contentType = rangeResponse.headers.get('content-type');
      return contentType;
    }
    
    return null;
  } catch (error) {
    console.error('Error checking URL content type:', error);
    return null;
  }
};

/**
 * Infer content type from URL extension
 */
export const inferContentTypeFromUrl = (url: string): string => {
  const lowercaseUrl = url.toLowerCase();
  
  if (lowercaseUrl.endsWith('.jpg') || lowercaseUrl.endsWith('.jpeg')) {
    return 'image/jpeg';
  } else if (lowercaseUrl.endsWith('.png')) {
    return 'image/png';
  } else if (lowercaseUrl.endsWith('.gif')) {
    return 'image/gif';
  } else if (lowercaseUrl.endsWith('.webp')) {
    return 'image/webp';
  } else if (lowercaseUrl.endsWith('.svg')) {
    return 'image/svg+xml';
  } else if (lowercaseUrl.endsWith('.mp4')) {
    return 'video/mp4';
  } else if (lowercaseUrl.endsWith('.webm')) {
    return 'video/webm';
  } else if (lowercaseUrl.endsWith('.mov')) {
    return 'video/quicktime';
  } else if (lowercaseUrl.endsWith('.avi')) {
    return 'video/x-msvideo';
  }
  
  return 'application/octet-stream';
};

/**
 * Fix URLs with incorrect or missing content type
 */
export const fixUrlContentType = async (url: string): Promise<string> => {
  if (!url) return '';
  
  const actualContentType = await checkUrlContentType(url);
  const inferredContentType = inferContentTypeFromUrl(url);
  
  if (!actualContentType || actualContentType === 'application/octet-stream') {
    // Try to add the correct content type as a query parameter
    if (inferredContentType !== 'application/octet-stream') {
      return url.includes('?') 
        ? `${url}&contentType=${encodeURIComponent(inferredContentType)}` 
        : `${url}?contentType=${encodeURIComponent(inferredContentType)}`;
    }
  }
  
  return url;
};

/**
 * Check if a URL is accessible
 */
export const checkUrlAccessibility = async (url: string): Promise<boolean> => {
  try {
    if (!url) return false;
    
    // If it's a blob URL, it's likely accessible since it's local
    if (url.startsWith('blob:')) return true;
    
    // If it's a data URL, it's accessible
    if (url.startsWith('data:')) return true;
    
    // Try fetch with HEAD request first (efficient)
    const response = await fetch(url, { 
      method: 'HEAD',
      cache: 'no-store',
      credentials: 'omit'
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error checking URL accessibility:', error);
    return false;
  }
};

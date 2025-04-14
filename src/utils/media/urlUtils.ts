
/**
 * Add cache busting parameter to URL to prevent browser caching
 */
export const addCacheBuster = (url: string): string => {
  if (!url) return '';
  
  // Don't add cache busters to URLs that already have one
  if (url.includes('t=') && url.includes('&r=')) {
    return url;
  }
  
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  
  return url.includes('?') 
    ? `${url}&t=${timestamp}&r=${random}` 
    : `${url}?t=${timestamp}&r=${random}`;
};

export interface UrlContentInfo {
  isValid: boolean;
  contentType: string | null;
  status: number;
  headers: Record<string, string>;
  errorBody?: string;
}

/**
 * Check content type of a remote URL
 */
export const checkUrlContentType = async (url: string): Promise<UrlContentInfo> => {
  try {
    // First try with HEAD request which is more efficient
    const response = await fetch(url, { 
      method: 'HEAD', 
      cache: 'no-store',
      mode: 'cors',
      credentials: 'omit' // Don't send cookies for cross-origin requests
    });
    
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      const headers: Record<string, string> = {};
      
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      
      return {
        isValid: true,
        contentType,
        status: response.status,
        headers
      };
    }
    
    // If HEAD failed or no content-type, try with a small range GET request
    const rangeResponse = await fetch(url, { 
      headers: { Range: 'bytes=0-1024' },
      cache: 'no-store',
      mode: 'cors',
      credentials: 'omit'
    });
    
    const headers: Record<string, string> = {};
    rangeResponse.headers.forEach((value, key) => {
      headers[key] = value;
    });
    
    let errorBody;
    if (!rangeResponse.ok) {
      try {
        errorBody = await rangeResponse.text();
      } catch (e) {
        // Unable to get error body, ignore
      }
    }
    
    return {
      isValid: rangeResponse.ok || rangeResponse.status === 206,
      contentType: rangeResponse.headers.get('content-type'),
      status: rangeResponse.status,
      headers,
      errorBody
    };
    
  } catch (error) {
    console.error('Error checking URL content type:', error);
    return {
      isValid: false,
      contentType: null,
      status: 0,
      headers: {},
      errorBody: error instanceof Error ? error.message : String(error)
    };
  }
};

/**
 * Infer content type from URL extension
 */
export const inferContentTypeFromUrl = (url: string): string => {
  if (!url) return 'application/octet-stream';
  
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
 * Get a clean version of a URL without query parameters
 */
export const getCleanUrl = (url: string): string => {
  if (!url) return '';
  return url.split('?')[0];
};

/**
 * Fix URLs with incorrect or missing content type
 */
export const fixUrlContentType = async (url: string): Promise<string> => {
  if (!url) return '';
  
  // Get content info from the URL
  const contentInfoResult = await checkUrlContentType(url);
  
  // If not valid or no content type, try to infer from the URL
  if (!contentInfoResult.isValid || !contentInfoResult.contentType) {
    const inferredContentType = inferContentTypeFromUrl(url);
    
    // Add the inferred content type as a query parameter
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
      mode: 'cors',
      credentials: 'omit'
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error checking URL accessibility:', error);
    return false;
  }
};

/**
 * Get a media URL that works reliably for display
 * This is our main function for getting a media URL ready for display
 */
export const getDisplayableMediaUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  
  // Check for special URLs that don't need processing
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  
  // Add cache busting parameters to ensure fresh content loading
  return addCacheBuster(url);
};


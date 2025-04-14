
/**
 * Debug a media URL to identify common issues
 */
export const debugMediaUrl = (url: string): void => {
  if (!url) {
    console.error("Cannot debug empty URL");
    return;
  }
  
  console.log(`Debugging media URL: ${url}`);
  
  try {
    // Log the URL components to help identify issues
    const urlObj = new URL(url);
    console.log(`URL protocol: ${urlObj.protocol}`);
    console.log(`URL host: ${urlObj.host}`);
    console.log(`URL pathname: ${urlObj.pathname}`);
    console.log(`URL search params: ${urlObj.search}`);
    
    // Check for common issues
    if (url.includes('undefined')) {
      console.error('URL contains "undefined" - likely constructed with an undefined variable');
    }
    
    if (url.includes('null')) {
      console.error('URL contains "null" - likely constructed with a null variable');
    }
    
    // Check if URL is already cache-busted
    if (url.includes('t=') || url.includes('r=') || url.includes('timestamp=')) {
      console.log('URL already includes cache-busting parameters');
    }
    
    // Check for Supabase storage URL pattern
    if (url.includes('storage/v1/object/public/')) {
      console.log('URL is a Supabase storage URL');
      
      // Check if the correct bucket is being used
      const matches = url.match(/\/storage\/v1\/object\/public\/([^\/]+)/);
      if (matches && matches[1]) {
        console.log(`Bucket name: ${matches[1]}`);
        
        // Validate bucket name
        const validBuckets = ['media', 'posts', 'videos', 'avatars', 'banners', 'stories', 'shorts'];
        if (!validBuckets.includes(matches[1])) {
          console.warn(`Bucket '${matches[1]}' may not exist or is not standard`);
        }
      }
    }
  } catch (error) {
    console.error(`Failed to analyze URL: ${error}`);
  }
};

/**
 * Infer content type from file extension
 */
export const inferContentTypeFromUrl = (url: string): string | null => {
  try {
    // Remove query parameters and get the path
    const urlPath = url.split('?')[0];
    // Get the extension
    const extension = urlPath.split('.').pop()?.toLowerCase();
    
    if (!extension) return null;
    
    // Map extensions to content types
    const contentTypeMap: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      'mp4': 'video/mp4',
      'mov': 'video/quicktime',
      'webm': 'video/webm',
      'avi': 'video/x-msvideo'
    };
    
    return contentTypeMap[extension] || null;
  } catch (error) {
    console.warn('Failed to infer content type:', error);
    return null;
  }
};

/**
 * Attempts to work around CORS issues for images
 */
export const attemptImageCorsWorkaround = async (url: string): Promise<string | null> => {
  try {
    // Try to proxy the image through a blob URL
    const response = await fetch(url, {
      mode: 'cors',
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return null;
    }
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.warn('CORS workaround failed:', error);
    return null;
  }
};

/**
 * Fetch image as blob and return object URL
 */
export const fetchImageAsBlob = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    
    if (!response.ok) {
      return null;
    }
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.warn('Failed to fetch image as blob:', error);
    return null;
  }
};

/**
 * Extract a direct path from a storage URL
 */
export const extractDirectImagePath = (url: string): string | null => {
  try {
    if (!url) return null;
    
    // Attempt to extract direct path from common storage URL patterns
    if (url.includes('/storage/v1/object/public/')) {
      const pattern = /\/storage\/v1\/object\/public\/([^\/]+)\/(.+?)(?:\?|$)/;
      const match = url.match(pattern);
      
      if (match) {
        const bucket = match[1];
        const path = match[2];
        return `/api/storage/${bucket}/${path}`;
      }
    }
    
    return null;
  } catch (error) {
    console.warn('Failed to extract direct path:', error);
    return null;
  }
};

/**
 * Check URL content type 
 */
export const checkUrlContentType = async (url: string): Promise<string | null> => {
  try {
    // Try HEAD request first
    const response = await fetch(url, {
      method: 'HEAD',
      headers: { 'Cache-Control': 'no-cache' }
    });
    
    if (response.ok) {
      return response.headers.get('content-type');
    }
    
    return null;
  } catch (error) {
    console.warn('Failed to check URL content type:', error);
    return null;
  }
};

/**
 * Fix URL content type by adding proper extension
 */
export const fixUrlContentType = (url: string, contentType: string): string => {
  if (!url || !contentType) return url;
  
  const extensionMap: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'video/mp4': '.mp4',
    'video/quicktime': '.mov',
    'video/webm': '.webm'
  };
  
  const extension = extensionMap[contentType];
  if (!extension) return url;
  
  // Check if URL already has correct extension
  if (url.toLowerCase().endsWith(extension)) return url;
  
  // Remove query params, add extension, then add params back
  const [baseUrl, params] = url.split('?');
  const newBaseUrl = baseUrl + extension;
  return params ? `${newBaseUrl}?${params}` : newBaseUrl;
};

// No duplicate exports - removed the redundant export block at the end

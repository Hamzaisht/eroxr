
/**
 * Utility functions for handling media URLs
 */

/**
 * Add cache busting parameters to a URL
 */
export const addCacheBuster = (url: string): string => {
  if (!url) return '';
  
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  
  return url.includes('?') 
    ? `${url}&t=${timestamp}&r=${random}` 
    : `${url}?t=${timestamp}&r=${random}`;
};

/**
 * Check if a URL is accessible
 */
export const checkUrlAccessibility = async (url: string): Promise<boolean> => {
  if (!url) return false;
  
  try {
    // For Supabase storage URLs, we need special handling
    if (url.includes('supabase') && url.includes('/storage/v1/object/')) {
      // Use fetch with no-cors mode to check if resource exists
      const response = await fetch(url, {
        method: 'HEAD',
        headers: {
          'Cache-Control': 'no-cache',
        },
        cache: 'no-store',
        mode: 'no-cors', // This allows checking cross-origin resources
      });
      
      // With no-cors we can't access status, but if it doesn't throw an error, 
      // there's at least something at that URL
      return true;
    }
    
    // Standard approach for other URLs
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'Cache-Control': 'no-cache',
      },
      cache: 'no-store',
    });
    
    return response.ok;
  } catch (error) {
    console.warn('URL accessibility check failed:', error);
    return false;
  }
};

/**
 * Check URL content type and metadata
 */
export const checkUrlContentType = async (url: string): Promise<{
  isValid: boolean;
  contentType: string | null;
  headers: Record<string, string>;
  status: number;
}> => {
  try {
    // Special handling for Supabase URLs that might have CORS issues
    if (url.includes('supabase') && url.includes('/storage/v1/object/')) {
      // For Supabase, we'll make an assumption based on file extension
      const extension = url.split('.').pop()?.split('?')[0].toLowerCase();
      const contentType = inferContentTypeFromUrl(url);
      
      return {
        isValid: !!contentType,
        contentType,
        headers: {},
        status: 200 // Assume success
      };
    }
    
    // Standard approach
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'Cache-Control': 'no-cache',
      },
      cache: 'no-store',
    });
    
    const contentType = response.headers.get('content-type');
    const headersObj: Record<string, string> = {};
    
    response.headers.forEach((value, key) => {
      headersObj[key] = value;
    });
    
    // Check if the content type is valid for media
    const isValid = contentType !== null && (
      contentType.startsWith('image/') || 
      contentType.startsWith('video/') ||
      contentType.startsWith('audio/')
    );
    
    console.log(`Content type for ${url}: ${contentType} (valid: ${isValid})`);
    if (!isValid) {
      console.warn('Invalid content type detected:', headersObj);
    }
    
    return {
      isValid,
      contentType,
      headers: headersObj,
      status: response.status
    };
  } catch (error) {
    console.error('Content type check failed:', error);
    
    // If CORS error, try to infer content type from URL
    const inferredType = inferContentTypeFromUrl(url);
    return {
      isValid: !!inferredType,
      contentType: inferredType,
      headers: {},
      status: 0
    };
  }
};

/**
 * Fix URL content type by forcing download as blob
 */
export const fixUrlContentType = async (url: string, expectedType: string): Promise<string> => {
  try {
    console.log(`Fixing content type for ${url} to ${expectedType}`);
    
    // Download as blob and create a local object URL with correct type
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
    
    const blob = await response.blob();
    
    // Create a new blob with the correct content type
    const fixedBlob = new Blob([await blob.arrayBuffer()], { 
      type: expectedType 
    });
    
    // Create and return a local URL for the fixed blob
    return URL.createObjectURL(fixedBlob);
  } catch (error) {
    console.error('Failed to fix content type:', error);
    return url; // Return original URL if fixing failed
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

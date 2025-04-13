
/**
 * Debugging utilities for media URLs
 */

import { checkUrlContentType, inferContentTypeFromUrl } from './urlUtils';

/**
 * Debug a media URL to identify common issues
 */
export const debugMediaUrl = (url: string): void => {
  if (!url) {
    console.error("Cannot debug empty URL");
    return;
  }
  
  console.log(`Debugging media URL: ${url}`);
  
  // Since we don't want to return a Promise, we'll log inside this function
  // and not use async/await or .then syntax
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
    
    // Make non-blocking content type check
    checkUrlContentType(url).then(({ contentType, isValid, headers, status }) => {
      console.log(`Content type: ${contentType || 'unknown'}`);
      console.log(`Valid media type: ${isValid}`);
      console.log(`Status code: ${status}`);
      
      if (!isValid) {
        console.warn('Media type validation failed - URL may return incorrect content type');
        
        // Suggest content type based on URL
        const inferredType = inferContentTypeFromUrl(url);
        if (inferredType) {
          console.log(`Inferred content type from URL: ${inferredType}`);
        }
      }
    }).catch(error => {
      console.error('Error checking content type:', error);
    });
  } catch (error) {
    console.error(`Failed to debug URL: ${error}`);
  }
};

/**
 * Check if the response indicates a debug error 
 */
export const isDebugErrorResponse = (response: any): boolean => {
  if (!response) return false;
  
  const isError = response.error || 
                  response.status === 'error' || 
                  (response.data && response.data.error);
                  
  return isError;
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
 * Try to extract a direct path from a storage URL
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
 * Handle case when server returns JSON instead of media content
 */
export const handleJsonContentTypeIssue = async (url: string): Promise<string | null> => {
  try {
    // Try to fetch the content and see if it's JSON
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return null;
    }
    
    // Try to parse as JSON to see if we're getting an error response
    const text = await response.text();
    
    try {
      const json = JSON.parse(text);
      console.warn('Server returned JSON instead of media:', json);
      
      if (json.signedURL) {
        console.log('Found signedURL in response, using it instead');
        return json.signedURL;
      }
      
      if (json.url) {
        console.log('Found url in response, using it instead');
        return json.url;
      }
      
      return null;
    } catch {
      // Not JSON, probably correct media response
      return url;
    }
  } catch (error) {
    console.warn('JSON content type check failed:', error);
    return null;
  }
};

/**
 * Force fetch a URL as a specific content type
 */
export const forceFetchAsContentType = async (
  url: string, 
  type: 'image' | 'video' | 'audio'
): Promise<string | null> => {
  try {
    // Determine expected content type
    let expectedType = 'application/octet-stream';
    switch (type) {
      case 'image':
        expectedType = 'image/jpeg'; // Default to JPEG
        break;
      case 'video':
        expectedType = 'video/mp4'; // Default to MP4
        break;
      case 'audio':
        expectedType = 'audio/mpeg'; // Default to MP3
        break;
    }
    
    // Try to infer more specific content type from URL
    const inferredType = inferContentTypeFromUrl(url);
    if (inferredType) {
      expectedType = inferredType;
    }
    
    // Fetch and create a blob with correct content type
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    
    if (!response.ok) {
      return null;
    }
    
    const originalBlob = await response.blob();
    const fixedBlob = new Blob([await originalBlob.arrayBuffer()], { 
      type: expectedType 
    });
    
    return URL.createObjectURL(fixedBlob);
  } catch (error) {
    console.warn('Force fetch failed:', error);
    return null;
  }
};

/**
 * Try all possible strategies for loading an image
 */
export const tryAllImageLoadingStrategies = async (url: string): Promise<{
  success: boolean;
  url: string | null;
  strategy: string;
}> => {
  // Try different strategies in sequence
  try {
    // 1. First try direct blob fetch
    const blobUrl = await fetchImageAsBlob(url);
    if (blobUrl) {
      return { success: true, url: blobUrl, strategy: 'blob' };
    }
    
    // 2. Try CORS workaround
    const corsUrl = await attemptImageCorsWorkaround(url);
    if (corsUrl) {
      return { success: true, url: corsUrl, strategy: 'cors-workaround' };
    }
    
    // 3. Try extracting direct path
    const directPath = extractDirectImagePath(url);
    if (directPath) {
      const directUrl = await fetchImageAsBlob(directPath);
      if (directUrl) {
        return { success: true, url: directUrl, strategy: 'direct-path' };
      }
    }
    
    // 4. Check for content type issues
    const jsonFixUrl = await handleJsonContentTypeIssue(url);
    if (jsonFixUrl && jsonFixUrl !== url) {
      const fixedUrl = await fetchImageAsBlob(jsonFixUrl);
      if (fixedUrl) {
        return { success: true, url: fixedUrl, strategy: 'json-fix' };
      }
    }
    
    // 5. Force content type
    const forcedUrl = await forceFetchAsContentType(url, 'image');
    if (forcedUrl) {
      return { success: true, url: forcedUrl, strategy: 'forced-type' };
    }
    
    // All strategies failed
    return { success: false, url: null, strategy: 'none' };
  } catch (error) {
    console.error('All image loading strategies failed:', error);
    return { success: false, url: null, strategy: 'error' };
  }
};

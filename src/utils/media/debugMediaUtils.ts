
/**
 * Utility to debug media loading issues
 */
export const debugMediaUrl = async (url: string | null) => {
  if (!url) {
    console.error("Cannot debug null URL");
    return { success: false, error: "Null URL" };
  }
  
  console.group(`Debugging media URL: ${url}`);
  
  try {
    // Test with HEAD request first
    console.log("Testing with HEAD request...");
    const headResponse = await fetch(url, { 
      method: 'HEAD',
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-cache',
      headers: {
        'Origin': window.location.origin,
        'Accept': 'image/*, video/*, application/octet-stream'
      }
    });
    console.log(`HEAD status: ${headResponse.status}`);
    
    // Test with GET request
    console.log("Testing with GET request...");
    const getResponse = await fetch(url, {
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-cache',
      headers: {
        'Origin': window.location.origin,
        'Accept': 'image/*, video/*, application/octet-stream'
      }
    });
    console.log(`GET status: ${getResponse.status}`);
    
    // Try to analyze the response content type
    const contentType = getResponse.headers.get('content-type');
    console.log(`Content-Type: ${contentType || 'unknown'}`);

    // Specifically check if content type mismatch might be causing issues
    if (contentType && contentType.includes('application/json')) {
      console.warn("Content type is application/json instead of an image type!");
      
      // Try to read the JSON response to see if it contains an error message
      try {
        const jsonResponse = await getResponse.clone().json();
        console.log("JSON response:", jsonResponse);
        
        if (jsonResponse.error) {
          return { 
            success: false, 
            error: `Server returned error: ${jsonResponse.error}`,
            contentType,
            jsonResponse
          };
        }
      } catch (e) {
        console.log("Could not parse response as JSON");
      }
    }

    // Check for access-control headers
    const accessControlAllowOrigin = getResponse.headers.get('access-control-allow-origin');
    const accessControlAllowMethods = getResponse.headers.get('access-control-allow-methods');
    const accessControlAllowHeaders = getResponse.headers.get('access-control-allow-headers');
    
    console.log('CORS Headers:', {
      'Access-Control-Allow-Origin': accessControlAllowOrigin || 'not present',
      'Access-Control-Allow-Methods': accessControlAllowMethods || 'not present',
      'Access-Control-Allow-Headers': accessControlAllowHeaders || 'not present'
    });
    
    if (getResponse.ok) {
      console.log("URL is accessible!");
      
      // Check if content can be loaded in browser
      if (url.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)) {
        await getImageDimensions(url)
          .then(dimensions => console.log(`Image dimensions: ${dimensions.width}x${dimensions.height}`))
          .catch(err => console.log('Could not load as image:', err.message));
      }
      
      return { 
        success: true,
        contentType,
        cors: {
          allowOrigin: accessControlAllowOrigin,
          allowMethods: accessControlAllowMethods,
          allowHeaders: accessControlAllowHeaders
        },
        headers: Array.from(getResponse.headers.entries()).reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {} as Record<string, string>),
        hasInvalidContentType: contentType && !contentType.startsWith('image/') && url.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)
      };
    } else {
      console.error("URL returned error status:", getResponse.status);
      return { 
        success: false, 
        error: `HTTP error: ${getResponse.status}`,
        headers: Array.from(getResponse.headers.entries()).reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {} as Record<string, string>)
      };
    }
  } catch (error: any) {
    console.error("Error accessing URL:", error);
    return { 
      success: false, 
      error: error.message,
      errorType: error.name,
      isCorsError: error.name === 'TypeError' && error.message.includes('CORS')
    };
  } finally {
    console.groupEnd();
  }
};

/**
 * Checks if the URL contains a cache buster
 */
export const hasCacheBuster = (url: string): boolean => {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.has('t') || urlObj.searchParams.has('r');
  } catch (e) {
    return false;
  }
};

/**
 * Gets image dimensions if possible
 */
export const getImageDimensions = (url: string): Promise<{width: number, height: number}> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    // Set a timeout to avoid hanging
    const timeout = setTimeout(() => {
      reject(new Error('Image loading timed out'));
    }, 10000);
    
    img.onload = () => {
      clearTimeout(timeout);
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.onerror = (e) => {
      clearTimeout(timeout);
      reject(new Error(`Failed to load image: ${e instanceof Error ? e.message : 'Unknown error'}`));
    };
    
    // Add cache-buster to avoid cached errors
    const cacheBuster = `${url.includes('?') ? '&' : '?'}_cb=${Date.now()}`;
    img.src = url + cacheBuster;
  });
};

/**
 * Check if a URL is being blocked by CORS
 */
export const checkCorsBlocking = async (url: string): Promise<{blocked: boolean, reason?: string}> => {
  try {
    // Test with preflight OPTIONS request
    const corsCheckResponse = await fetch(url, {
      method: 'OPTIONS',
      mode: 'cors',
      credentials: 'omit',
      headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type',
        'Accept': 'image/*, video/*, application/octet-stream'
      }
    });
    
    // Check if we have proper CORS headers in response
    const allowOrigin = corsCheckResponse.headers.get('access-control-allow-origin');
    const allowMethods = corsCheckResponse.headers.get('access-control-allow-methods');
    
    if (!allowOrigin) {
      return { blocked: true, reason: 'Missing Access-Control-Allow-Origin header' };
    }
    
    if (allowOrigin !== '*' && allowOrigin !== window.location.origin) {
      return { blocked: true, reason: `Origin not allowed: ${allowOrigin}` };
    }
    
    if (!allowMethods || !allowMethods.includes('GET')) {
      return { blocked: true, reason: 'GET method not allowed by CORS policy' };
    }
    
    return { blocked: false };
  } catch (error) {
    // If fetch throws an error, it's likely a CORS issue
    return { blocked: true, reason: error instanceof Error ? error.message : 'Unknown CORS error' };
  }
};

/**
 * Attempts to work around CORS issues by using an image object
 */
export const attemptImageCorsWorkaround = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      try {
        // Create a canvas and draw the image to get a data URL
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      } catch (e) {
        reject(new Error('Failed to convert image to data URL'));
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for CORS workaround'));
    };
    
    // Add timestamp to prevent caching
    img.src = `${url}${url.includes('?') ? '&' : '?'}_t=${Date.now()}`;
  });
};

/**
 * Tries to fetch the actual image data directly as a blob
 * This can sometimes work when the image request is returned with incorrect content-type
 */
export const fetchImageAsBlob = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url, {
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-cache',
      headers: {
        'Accept': 'image/*, video/*, application/octet-stream'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    // Get the response as a blob
    const blob = await response.blob();
    
    // Create an object URL from the blob
    const objectUrl = URL.createObjectURL(blob);
    return objectUrl;
  } catch (error) {
    console.error("Failed to fetch image as blob:", error);
    throw error;
  }
};

/**
 * Direct path approach - attempts to extract the actual path from URLs
 * that might be wrapped in JSON responses
 */
export const extractDirectImagePath = (url: string): string | null => {
  // Check for URL patterns that suggest the image path is wrapped in a different URL structure
  if (url.includes('storage/v1/object/public')) {
    // Extract the actual path after public/
    const match = url.match(/\/public\/([^?]+)/);
    if (match && match[1]) {
      const bucket = match[1].split('/')[0];
      const path = match[1].substring(bucket.length + 1);
      
      // Try to use a direct path approach
      const supabaseUrl = url.split('/storage/v1')[0];
      return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
    }
  }
  
  return null;
};


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
      credentials: 'omit'
    });
    console.log(`HEAD status: ${headResponse.status}`);
    
    // Test with GET request
    console.log("Testing with GET request...");
    const getResponse = await fetch(url, {
      mode: 'cors',
      credentials: 'omit'
    });
    console.log(`GET status: ${getResponse.status}`);
    
    // Try to analyze the response content type
    const contentType = getResponse.headers.get('content-type');
    console.log(`Content-Type: ${contentType || 'unknown'}`);
    
    if (getResponse.ok) {
      console.log("URL is accessible!");
      return { 
        success: true,
        contentType,
        headers: Array.from(getResponse.headers.entries()).reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {} as Record<string, string>)
      };
    } else {
      console.error("URL returned error status:", getResponse.status);
      return { success: false, error: `HTTP error: ${getResponse.status}` };
    }
  } catch (error: any) {
    console.error("Error accessing URL:", error);
    return { success: false, error: error.message };
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
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
};


/**
 * Utility functions for debugging media URLs and fixing common issues
 * like CORS errors and content type mismatches
 */

/**
 * Debug a media URL by analyzing response headers and content
 */
export const debugMediaUrl = async (url: string) => {
  if (!url) return { error: 'No URL provided' };
  
  try {
    // First, try a HEAD request to get headers without downloading the content
    const headResponse = await fetch(url, { 
      method: 'HEAD',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'omit'
    }).catch(err => {
      console.log(`HEAD request failed for ${url}:`, err);
      return null;
    });
    
    // Get content type from HEAD request if available
    let contentType = headResponse?.headers?.get('content-type');
    let contentLength = headResponse?.headers?.get('content-length');
    let cors = {
      allowOrigin: headResponse?.headers?.get('access-control-allow-origin') || null,
      allowMethods: headResponse?.headers?.get('access-control-allow-methods') || null,
      allowHeaders: headResponse?.headers?.get('access-control-allow-headers') || null
    };
    
    // Log all headers for debugging
    const headersDebug = [];
    if (headResponse?.headers) {
      headResponse.headers.forEach((value, key) => {
        headersDebug.push(`${key}: ${value}`);
      });
    }
    
    // If HEAD request failed, try a GET request instead
    if (!headResponse) {
      console.log(`Falling back to GET request for ${url}`);
      const getResponse = await fetch(url, { 
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'omit'
      }).catch(err => {
        console.log(`GET request also failed for ${url}:`, err);
        return { 
          error: err.message, 
          errorType: err.constructor.name,
          isCorsError: err.message.includes('CORS') || err instanceof TypeError
        };
      });
      
      if (!getResponse.headers) {
        return { 
          error: 'Network request failed',
          errorType: 'NetworkError',
          isCorsError: true
        };
      }
      
      contentType = getResponse.headers?.get('content-type');
      contentLength = getResponse.headers?.get('content-length');
      cors = {
        allowOrigin: getResponse.headers?.get('access-control-allow-origin') || null,
        allowMethods: getResponse.headers?.get('access-control-allow-methods') || null,
        allowHeaders: getResponse.headers?.get('access-control-allow-headers') || null
      };
      
      // Check if response is JSON to detect error responses
      let isJSON = false;
      let responseBody = null;
      
      if (contentType?.includes('application/json')) {
        isJSON = true;
        try {
          const clonedResponse = getResponse.clone();
          responseBody = await clonedResponse.json().catch(() => null);
        } catch (err) {
          console.log('Error parsing JSON response:', err);
        }
      }
      
      return {
        url,
        status: getResponse.status,
        statusText: getResponse.statusText,
        contentType,
        contentLength,
        cors,
        isJSON,
        responseBody,
        headers: Array.from(getResponse.headers.entries())
      };
    }
    
    return {
      url,
      status: headResponse.status,
      statusText: headResponse.statusText,
      contentType,
      contentLength,
      cors,
      headersDebug,
      headers: Array.from(headResponse.headers.entries())
    };
  } catch (err) {
    console.error('Error in debugMediaUrl:', err);
    return {
      url,
      error: err.message,
      errorType: err.constructor.name,
      isCorsError: err.message.includes('CORS') || err instanceof TypeError
    };
  }
};

/**
 * Attempt to work around CORS issues by fetching the image as a blob and
 * creating a local object URL
 */
export const attemptImageCorsWorkaround = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url, {
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'omit'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error('CORS workaround failed:', err);
    throw err;
  }
};

/**
 * Fetches an image as a blob and returns a data URL
 */
export const fetchImageAsBlob = async (url: string): Promise<string> => {
  try {
    // Add cache busting to avoid cached responses
    const cacheBustedUrl = `${url}${url.includes('?') ? '&' : '?'}_cb=${Date.now()}`;
    
    const response = await fetch(cacheBustedUrl, {
      cache: 'no-cache',
      credentials: 'omit',
      headers: {
        // Some servers need to think we're a browser
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        // Request image/* content instead of whatever the server might default to
        'Accept': 'image/*'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    
    const blob = await response.blob();
    
    // Force the mime type if it's coming as application/json
    const contentType = response.headers.get('content-type');
    let correctBlob = blob;
    
    // If the content type is application/json but the URL suggests it's an image,
    // create a new blob with the correct content type
    if (contentType?.includes('application/json') && 
        (url.match(/\.(jpg|jpeg|png|gif|webp)$/i) || url.includes('image'))) {
      
      // Try to determine the correct mime type from the URL
      let mimeType = 'image/jpeg';  // Default mime type
      
      if (url.match(/\.png$/i)) mimeType = 'image/png';
      else if (url.match(/\.gif$/i)) mimeType = 'image/gif';
      else if (url.match(/\.webp$/i)) mimeType = 'image/webp';
      
      correctBlob = new Blob([await blob.arrayBuffer()], { type: mimeType });
    }
    
    return URL.createObjectURL(correctBlob);
  } catch (err) {
    console.error('Fetch as blob failed:', err);
    throw err;
  }
};

/**
 * Extract direct path for images from storage URLs
 * This can bypass some issues with URL structures
 */
export const extractDirectImagePath = (url: string): string | null => {
  if (!url) return null;
  
  // Check if this is a Supabase storage URL
  if (!url.includes('supabase') || !url.includes('storage')) {
    return null;
  }
  
  // Special handling for stories bucket which seems to have issues
  if (url.includes('/stories/')) {
    try {
      // Try to parse the URL
      const urlObj = new URL(url);
      
      // Check if this is a storage/v1/object URL pattern
      if (url.includes('storage/v1/object')) {
        // Convert from storage/v1/object/public/bucket/path to storage/v1/render/image/public/bucket/path
        // This forces the correct content type
        return url.replace('storage/v1/object', 'storage/v1/render/image');
      }
    } catch (err) {
      console.error('URL parsing failed:', err);
    }
  }
  
  // No transformation needed or applicable
  return null;
};

/**
 * Try multiple strategies to load an image URL that's returning
 * application/json content type
 */
export const tryAllImageLoadingStrategies = async (url: string) => {
  // Strategy 1: Force content type via URL parameter (for Supabase)
  if (url.includes('supabase') && url.includes('storage')) {
    try {
      const contentTypeUrl = url.includes('?') 
        ? `${url}&contentType=image/jpeg` 
        : `${url}?contentType=image/jpeg`;
      
      const response = await fetch(contentTypeUrl, { method: 'HEAD' });
      if (response.ok && !response.headers.get('content-type')?.includes('application/json')) {
        return { url: contentTypeUrl, strategy: 'content-type-param', success: true };
      }
    } catch (err) {
      console.log('Strategy 1 failed:', err);
    }
    
    // Strategy 2: Convert object URL to render/image URL (for Supabase)
    if (url.includes('storage/v1/object')) {
      const renderUrl = url.replace('storage/v1/object', 'storage/v1/render/image');
      try {
        const response = await fetch(renderUrl, { method: 'HEAD' });
        if (response.ok) {
          return { url: renderUrl, strategy: 'render-image-url', success: true };
        }
      } catch (err) {
        console.log('Strategy 2 failed:', err);
      }
    }
  }
  
  // Strategy 3: Use blob URL
  try {
    const blobUrl = await fetchImageAsBlob(url);
    return { url: blobUrl, strategy: 'blob-url', success: true };
  } catch (err) {
    console.log('Strategy 3 failed:', err);
  }
  
  // If all strategies fail, return the original URL
  return { url, strategy: 'original', success: false };
};

/**
 * Special handler for content type mismatch when server returns JSON
 * for image requests
 */
export const handleJsonContentTypeIssue = async (url: string): Promise<string | null> => {
  if (!url) return null;
  
  // Strategy for Supabase storage URLs
  if (url.includes('supabase.co/storage')) {
    // Try the render endpoint for images
    if (url.includes('storage/v1/object/public')) {
      const renderUrl = url.replace(
        'storage/v1/object/public', 
        'storage/v1/render/image/public'
      );
      
      try {
        const response = await fetch(renderUrl, { method: 'HEAD' });
        if (response.ok) {
          return renderUrl;
        }
      } catch (err) {
        console.log('render endpoint approach failed:', err);
      }
    }
    
    // Try content-type parameter approach
    const contentTypeUrl = url.includes('?') 
      ? `${url}&contentType=image/jpeg` 
      : `${url}?contentType=image/jpeg`;
    
    try {
      const response = await fetch(contentTypeUrl, { method: 'HEAD' });
      if (response.ok) {
        return contentTypeUrl;
      }
    } catch (err) {
      console.log('content-type parameter approach failed:', err);
    }
  }
  
  // Generic approach - try to get as blob and create object URL
  try {
    return await fetchImageAsBlob(url);
  } catch (err) {
    console.log('blob approach failed:', err);
    return null;
  }
};

/**
 * Force fetch a URL as a specific content type regardless
 * of what the server returns
 */
export const forceFetchAsContentType = async (url: string, type: 'image' | 'video'): Promise<string | null> => {
  if (!url) return null;
  
  try {
    // For Supabase storage URLs, try the render endpoint
    if (url.includes('supabase.co/storage') && type === 'image') {
      if (url.includes('storage/v1/object/public')) {
        const renderUrl = url.replace(
          'storage/v1/object/public', 
          'storage/v1/render/image/public'
        );
        
        const response = await fetch(renderUrl, { method: 'HEAD' });
        if (response.ok) {
          return renderUrl;
        }
      }
      
      // Special handling for stories bucket
      if (url.includes('/stories/')) {
        // Try adding download=true parameter to force download instead of preview
        const downloadUrl = url.includes('?')
          ? `${url}&download=true` 
          : `${url}?download=true`;
          
        const response = await fetch(downloadUrl);
        if (response.ok) {
          const blob = await response.blob();
          // Force the blob to be treated as an image
          const imageBlob = new Blob([await blob.arrayBuffer()], { type: 'image/jpeg' });
          return URL.createObjectURL(imageBlob);
        }
      }
    }
    
    // Fallback to fetching as blob and forcing the content type
    const response = await fetch(url);
    if (!response.ok) return null;
    
    const blob = await response.blob();
    
    // Force the correct mime type based on requested type
    const mimeType = type === 'image' ? 'image/jpeg' : 'video/mp4';
    const typedBlob = new Blob([await blob.arrayBuffer()], { type: mimeType });
    
    return URL.createObjectURL(typedBlob);
  } catch (err) {
    console.error('Force fetch failed:', err);
    return null;
  }
};

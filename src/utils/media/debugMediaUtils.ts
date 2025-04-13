
/**
 * Utilities to help debug and fix media URL issues
 */

type DebugResult = {
  url: string;
  isAccessible: boolean;
  statusCode?: number;
  contentType?: string | null;
  headers?: Record<string, string>;
  isJSON?: boolean;
  error?: string;
};

type ErrorResponse = {
  error: string;
  isCorsError?: boolean;
  isNetworkError?: boolean;
};

/**
 * Check if a debug response is an error
 */
export const isDebugErrorResponse = (response: DebugResult | ErrorResponse): response is ErrorResponse => {
  return 'error' in response && typeof response.error === 'string';
};

/**
 * Debug a media URL to find issues
 */
export const debugMediaUrl = async (url: string): Promise<DebugResult | ErrorResponse> => {
  try {
    console.log(`Debugging media URL: ${url}`);
    
    // Try a HEAD request first to get headers
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'Cache-Control': 'no-cache',
      },
      cache: 'no-store',
    });
    
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    
    const contentType = response.headers.get('content-type');
    const isJSON = contentType?.includes('application/json');
    
    console.log(`Status: ${response.status}, Content-Type: ${contentType}`);
    
    return {
      url,
      isAccessible: response.ok,
      statusCode: response.status,
      contentType,
      headers,
      isJSON
    };
  } catch (error: any) {
    console.error(`Error debugging URL ${url}:`, error);
    
    // Try to detect if it's a CORS error
    const isCorsError = error.message?.includes('CORS') || 
                        error.name === 'TypeError' ||
                        error.message?.includes('cross-origin');
    
    // Try to detect network errors
    const isNetworkError = error.name === 'TypeError' && 
                          (error.message?.includes('network') || 
                           error.message?.includes('Failed to fetch'));
    
    return {
      error: error.message || 'Unknown error',
      isCorsError,
      isNetworkError
    };
  }
};

/**
 * Handle JSON content type issue
 */
export const handleJsonContentTypeIssue = async (url: string): Promise<string | null> => {
  try {
    console.log(`Attempting to fix JSON content type issue for: ${url}`);
    
    // Try to download as blob and infer media type
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
    
    // Get response as text
    const text = await response.text();
    
    // Check if it's actually JSON
    try {
      const jsonData = JSON.parse(text);
      console.error('Content is actual JSON, cannot fix:', jsonData);
      return null;
    } catch (e) {
      // Not JSON, likely binary data with wrong content type
      console.log('Content is not JSON, attempting to fix content type');
      
      // Try to infer type from URL or create generic image type
      let mimeType = 'image/jpeg';
      
      if (url.toLowerCase().endsWith('.png')) {
        mimeType = 'image/png';
      } else if (url.toLowerCase().endsWith('.webp')) {
        mimeType = 'image/webp';
      } else if (url.toLowerCase().endsWith('.gif')) {
        mimeType = 'image/gif';
      } else if (url.toLowerCase().endsWith('.mp4') || url.toLowerCase().includes('video')) {
        mimeType = 'video/mp4';
      }
      
      // Convert text back to blob with correct type
      const blob = new Blob([new TextEncoder().encode(text)], { type: mimeType });
      
      // Create object URL
      return URL.createObjectURL(blob);
    }
  } catch (error) {
    console.error('Failed to handle JSON content type issue:', error);
    return null;
  }
};

/**
 * Extract direct image path from Supabase storage URL
 */
export const extractDirectImagePath = (url: string): string | null => {
  try {
    // Example URL: https://ysqbdaeohlupucdmivkt.supabase.co/storage/v1/object/public/posts/user/image.jpg
    const match = url.match(/\/storage\/v1\/object\/public\/([^\/]+)\/(.+)/);
    if (!match) return null;
    
    const bucket = match[1];
    const path = match[2];
    
    // Try alternate path format
    return `${url.split('/storage/v1/object/public/')[0]}/storage/v1/object/sign/${bucket}/${path}`;
  } catch (err) {
    console.error('Error extracting direct path:', err);
    return null;
  }
};

/**
 * Fetch image as blob and return as data URL
 */
export const fetchImageAsBlob = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(url, { 
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error('Error fetching as blob:', err);
    return null;
  }
};

/**
 * Attempt a workaround for CORS issues with images
 */
export const attemptImageCorsWorkaround = async (url: string): Promise<string | null> => {
  try {
    console.log(`Attempting CORS workaround for: ${url}`);
    
    // Try using a proxy service (this is just an example)
    // In production, you should use your own proxy
    // const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    
    // Instead of proxy, try to fetch directly as a blob and create an object URL
    const response = await fetch(url, { 
      mode: 'cors',
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error('CORS workaround failed:', err);
    return null;
  }
};

/**
 * Try all possible strategies to load an image
 */
export const tryAllImageLoadingStrategies = async (url: string): Promise<{
  success: boolean;
  url: string | null;
  strategy: string;
}> => {
  // Strategy 1: Try direct blob fetch
  try {
    const blobUrl = await fetchImageAsBlob(url);
    if (blobUrl) {
      return { success: true, url: blobUrl, strategy: 'blob' };
    }
  } catch (err) {
    console.error('Blob strategy failed:', err);
  }
  
  // Strategy 2: Try direct path
  try {
    const directPath = extractDirectImagePath(url);
    if (directPath) {
      const blobUrl = await fetchImageAsBlob(directPath);
      if (blobUrl) {
        return { success: true, url: blobUrl, strategy: 'direct-path' };
      }
    }
  } catch (err) {
    console.error('Direct path strategy failed:', err);
  }
  
  // Strategy 3: Try CORS workaround
  try {
    const corsWorkaround = await attemptImageCorsWorkaround(url);
    if (corsWorkaround) {
      return { success: true, url: corsWorkaround, strategy: 'cors-workaround' };
    }
  } catch (err) {
    console.error('CORS workaround failed:', err);
  }
  
  // Strategy 4: Try to force fetch with specific content type
  try {
    const forcedUrl = await forceFetchAsContentType(url, 'image');
    if (forcedUrl) {
      return { success: true, url: forcedUrl, strategy: 'forced-content-type' };
    }
  } catch (err) {
    console.error('Force fetch strategy failed:', err);
  }
  
  return { success: false, url: null, strategy: 'none' };
};

/**
 * Force fetch as specific content type
 */
export const forceFetchAsContentType = async (url: string, type: 'image' | 'video'): Promise<string | null> => {
  try {
    console.log(`Force fetching as ${type}: ${url}`);
    
    const response = await fetch(url, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
    
    const blob = await response.blob();
    
    // Create a new blob with the forced content type
    const contentType = type === 'image' ? 'image/jpeg' : 'video/mp4';
    const forcedBlob = new Blob([await blob.arrayBuffer()], { type: contentType });
    
    return URL.createObjectURL(forcedBlob);
  } catch (err) {
    console.error('Force fetch failed:', err);
    return null;
  }
};

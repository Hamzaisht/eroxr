
/**
 * Utility functions for debugging media loading issues
 */

// Log verbose info about a URL
export const debugMediaUrl = (url: string): void => {
  console.log(`Debug media URL: ${url}`);
  
  try {
    // Check if it's a Supabase URL
    if (url.includes('supabase')) {
      console.log('This is a Supabase storage URL');
      
      if (url.includes('/storage/v1/object/public/')) {
        const storagePattern = /\/storage\/v1\/object\/public\/([^\/]+)\/(.+)/;
        const match = url.match(storagePattern);
        
        if (match) {
          const bucket = match[1];
          const path = match[2].split('?')[0];
          console.log(`  - Bucket: ${bucket}`);
          console.log(`  - Path: ${path}`);
          console.log(`  - Has query params: ${url.includes('?')}`);
        }
      }
      
      if (url.includes('/storage/v1/object/sign/')) {
        console.log('This is a signed URL path which might be problematic');
      }
    }
  } catch (e) {
    console.error('Error during URL debugging:', e);
  }
};

// Extract the direct path from a Supabase URL
export const extractDirectImagePath = (url: string): string | null => {
  if (!url) return null;
  
  try {
    // Handle Supabase storage URLs
    if (url.includes('supabase') && url.includes('/storage/v1/object/public/')) {
      const storagePattern = /\/storage\/v1\/object\/public\/([^\/]+)\/(.+?)(?:\?|$)/;
      const match = url.match(storagePattern);
      
      if (match) {
        const bucket = match[1];
        const path = match[2];
        console.log(`Extracted path from URL: bucket=${bucket}, path=${path}`);
        
        // Construct a direct path - sometimes this works better
        return `https://ysqbdaeohlupucdmivkt.supabase.co/storage/v1/object/public/${bucket}/${path}`;
      }
    }
  } catch (e) {
    console.error('Error extracting direct path:', e);
  }
  
  return null;
};

// Attempt to work around CORS issues with images
export const attemptImageCorsWorkaround = async (url: string): Promise<string | null> => {
  try {
    console.log('Attempting CORS workaround for:', url);
    
    // Add cache busting parameter
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const cacheBustUrl = url.includes('?') 
      ? `${url}&t=${timestamp}&r=${random}` 
      : `${url}?t=${timestamp}&r=${random}`;
    
    return cacheBustUrl;
  } catch (e) {
    console.error('CORS workaround failed:', e);
    return null;
  }
};

// Try to fetch an image as a blob to handle CORS/content-type issues
export const fetchImageAsBlob = async (url: string): Promise<string | null> => {
  try {
    console.log('Fetching image as blob:', url);
    
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
    const objectUrl = URL.createObjectURL(blob);
    console.log('Created blob URL:', objectUrl);
    
    return objectUrl;
  } catch (e) {
    console.error('Blob fetch failed:', e);
    return null;
  }
};

// Force fetch a URL as a specific content type
export const forceFetchAsContentType = async (url: string, mediaType: 'image' | 'video'): Promise<string | null> => {
  try {
    console.log(`Force fetching as ${mediaType}: ${url}`);
    
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
    
    const contentType = mediaType === 'image' 
      ? 'image/jpeg'  // Assume JPEG for simplicity
      : 'video/mp4';  // Assume MP4 for videos
    
    const blob = await response.blob();
    const fixedBlob = new Blob([await blob.arrayBuffer()], { type: contentType });
    const objectUrl = URL.createObjectURL(fixedBlob);
    
    return objectUrl;
  } catch (e) {
    console.error('Force fetch failed:', e);
    return null;
  }
};

// Check for debug error responses from Supabase
export const isDebugErrorResponse = (response: Response): boolean => {
  return response.status === 400 && 
         response.headers.get('content-type')?.includes('application/json');
};

// Handle potential JSON content type issues with media
export const handleJsonContentTypeIssue = async (url: string, expectedType: string): Promise<string | null> => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': expectedType }
    });
    
    if (!response.ok) return null;
    
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      // If the response is JSON but should be media, it's likely an error
      console.warn('Received JSON when expecting media type:', expectedType);
      const json = await response.json();
      console.error('Error response:', json);
      return null;
    }
    
    // Create a blob with the correct type
    const blob = await response.blob();
    const fixedBlob = new Blob([await blob.arrayBuffer()], { type: expectedType });
    return URL.createObjectURL(fixedBlob);
  } catch (e) {
    console.error('JSON content type handling failed:', e);
    return null;
  }
};

// Try all image loading strategies
export const tryAllImageLoadingStrategies = async (url: string): Promise<{ success: boolean; url: string | null; strategy: string }> => {
  // Strategy 1: Simple cache busting
  try {
    const timestamp = Date.now();
    const cacheBustUrl = url.includes('?') 
      ? `${url}&t=${timestamp}` 
      : `${url}?t=${timestamp}`;
    
    const response = await fetch(cacheBustUrl, { 
      method: 'HEAD',
      cache: 'no-store'
    });
    
    if (response.ok) {
      return { success: true, url: cacheBustUrl, strategy: 'cache-bust' };
    }
  } catch (e) {
    console.warn('Cache busting strategy failed');
  }
  
  // Strategy 2: Blob URL approach
  try {
    const blobUrl = await fetchImageAsBlob(url);
    if (blobUrl) {
      return { success: true, url: blobUrl, strategy: 'blob-url' };
    }
  } catch (e) {
    console.warn('Blob URL strategy failed');
  }
  
  // Strategy 3: Force content type
  try {
    const forcedUrl = await forceFetchAsContentType(url, 'image');
    if (forcedUrl) {
      return { success: true, url: forcedUrl, strategy: 'forced-content-type' };
    }
  } catch (e) {
    console.warn('Force content type strategy failed');
  }
  
  // Strategy 4: Direct path extraction (for Supabase URLs)
  if (url.includes('supabase')) {
    const directUrl = extractDirectImagePath(url);
    if (directUrl) {
      try {
        const response = await fetch(directUrl, { 
          method: 'HEAD',
          cache: 'no-store'
        });
        
        if (response.ok) {
          return { success: true, url: directUrl, strategy: 'direct-path' };
        }
      } catch (e) {
        console.warn('Direct path strategy failed');
      }
    }
  }
  
  return { success: false, url: null, strategy: 'none' };
};

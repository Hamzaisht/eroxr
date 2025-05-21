
/**
 * Add cache busting parameter to URLs
 */
export const getPlayableMediaUrl = (url: string): string => {
  if (!url) return '';
  
  // Add cache busting parameter if needed
  const hasCacheBuster = url.includes('_cb=');
  if (!hasCacheBuster) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}_cb=${Date.now()}`;
  }
  
  return url;
};

/**
 * Process image URL for optimized loading
 */
export const getOptimizedImageUrl = (url: string, width?: number, quality?: number): string => {
  if (!url) return '';
  
  // Check if URL is from Supabase storage
  if (url.includes('supabase.co/storage/v1')) {
    // If width is specified, add it to the URL
    if (width) {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}width=${width}${quality ? `&quality=${quality}` : ''}`;
    }
  }
  
  return url;
};

/**
 * Parse media URL to extract useful information
 */
export const parseMediaUrl = (url: string): { 
  domain: string; 
  path: string;
  isSupabase: boolean;
  fileName: string | null;
  extension: string | null;
} => {
  if (!url) {
    return { 
      domain: '', 
      path: '', 
      isSupabase: false, 
      fileName: null,
      extension: null
    };
  }
  
  try {
    const parsedUrl = new URL(url);
    const pathSegments = parsedUrl.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    const fileName = lastSegment || null;
    const extension = fileName ? fileName.split('.').pop() || null : null;
    
    return {
      domain: parsedUrl.hostname,
      path: parsedUrl.pathname,
      isSupabase: parsedUrl.hostname.includes('supabase'),
      fileName,
      extension
    };
  } catch (e) {
    return { 
      domain: '', 
      path: '', 
      isSupabase: false, 
      fileName: null,
      extension: null
    };
  }
};

/**
 * Validate a URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Create a thumbnail URL from a video URL
 */
export const createThumbnailUrl = (videoUrl: string): string => {
  if (!videoUrl) return '';
  
  // For Supabase storage URLs
  if (videoUrl.includes('supabase.co/storage/v1')) {
    // Add a timestamp parameter to make it unique
    return `${videoUrl}?thumbnail=true&t=${Date.now()}`;
  }
  
  return videoUrl;
};


/**
 * A unified utility for processing media URLs to ensure they load correctly
 */

/**
 * Add cache busting parameter to URL to prevent browser caching
 * This is simpler than previous versions to avoid URL corruption
 */
export const addCacheBuster = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  
  const timestamp = Date.now();
  return url.includes('?') 
    ? `${url}&t=${timestamp}` 
    : `${url}?t=${timestamp}`;
};

/**
 * Clean up a URL by removing query parameters
 */
export const getCleanUrl = (url: string): string => {
  if (!url) return '';
  return url.split('?')[0];
};

/**
 * Determine if a URL points to video content based on extension
 */
export const isVideoUrl = (url: string): boolean => {
  if (!url) return false;
  
  const cleanUrl = url.toLowerCase();
  return cleanUrl.endsWith('.mp4') || 
         cleanUrl.endsWith('.webm') || 
         cleanUrl.endsWith('.mov') || 
         cleanUrl.endsWith('.avi') ||
         cleanUrl.includes('/videos/') ||
         cleanUrl.includes('/shorts/');
};

/**
 * Get a direct playable URL for media that works reliably
 */
export const getDirectMediaUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  
  // Handle special URLs
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  
  // Clean the URL
  const cleanUrl = getCleanUrl(url);
  
  // Add cache busting to ensure fresh content
  return addCacheBuster(cleanUrl);
};

/**
 * Extract URL from a media object or string
 */
export const extractMediaUrl = (media: any): string => {
  if (!media) return '';
  
  // Handle direct string input
  if (typeof media === 'string') {
    return getDirectMediaUrl(media);
  }
  
  // Extract URL from object based on common properties
  const url = 
    media.video_url || 
    (Array.isArray(media.video_urls) && media.video_urls.length > 0 ? media.video_urls[0] : null) ||
    media.media_url ||
    (Array.isArray(media.media_url) && media.media_url.length > 0 ? media.media_url[0] : null) ||
    media.url ||
    '';
  
  return getDirectMediaUrl(url);
};

/**
 * Simple implementation to check URL accessibility
 * Returns whether the URL can be accessed and what its content type is
 */
export const checkUrlAccessibility = async (url: string): Promise<{ 
  accessible: boolean; 
  status?: number;
  contentType?: string;
  error?: string;
}> => {
  try {
    if (!url) return { accessible: false, error: 'No URL provided' };
    
    // If it's a blob or data URL, assume it's accessible
    if (url.startsWith('blob:') || url.startsWith('data:')) {
      return { accessible: true };
    }
    
    // Try fetch with HEAD request to avoid downloading the full resource
    const response = await fetch(url, { 
      method: 'HEAD',
      cache: 'no-store',
      mode: 'cors'
    });
    
    return { 
      accessible: response.ok, 
      status: response.status,
      contentType: response.headers.get('content-type') || undefined
    };
  } catch (error) {
    console.error('Error checking URL accessibility:', error);
    return { 
      accessible: false, 
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

/**
 * Create variations of a URL to try for repair
 */
export const tryRepairUrl = (url: string): string[] => {
  if (!url) return [];
  
  const variations: string[] = [
    url,
    addCacheBuster(url)
  ];
  
  // Try without "public" if present
  if (url.includes('/public/')) {
    const withoutPublic = url.replace('/public/', '/');
    variations.push(withoutPublic);
    variations.push(addCacheBuster(withoutPublic));
  }
  
  return variations;
};

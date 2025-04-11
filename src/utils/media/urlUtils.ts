
/**
 * Adds a cache-busting parameter to prevent caching of media URLs
 */
export const addCacheBuster = (url: string | null): string | null => {
  if (!url) return null;
  
  // First, clean up any existing cache busters to avoid chaining too many
  let cleanUrl = url;
  try {
    const urlObj = new URL(url);
    // Remove any existing t= and r= parameters
    if (urlObj.searchParams.has('t')) urlObj.searchParams.delete('t');
    if (urlObj.searchParams.has('r')) urlObj.searchParams.delete('r');
    cleanUrl = urlObj.toString();
  } catch (e) {
    // If URL parsing fails, proceed with original URL
    console.warn("Could not parse URL for cleaning:", url);
  }
  
  // Generate unique timestamp and random string for effective cache busting
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  
  // Append cache busters to the URL
  return cleanUrl.includes('?') 
    ? `${cleanUrl}&t=${timestamp}&r=${random}` 
    : `${cleanUrl}?t=${timestamp}&r=${random}`;
};

/**
 * Checks if a URL is accessible and returns a promise
 * that resolves with true if accessible, false otherwise
 */
export const checkUrlAccessibility = async (url: string): Promise<boolean> => {
  if (!url) return false;
  
  try {
    // Use HEAD request to check if URL is accessible without downloading content
    const response = await fetch(url, { 
      method: 'HEAD',
      cache: 'no-store' // Prevent caching
    });
    
    return response.ok;
  } catch (error) {
    console.error(`URL accessibility check failed for ${url}:`, error);
    return false;
  }
};

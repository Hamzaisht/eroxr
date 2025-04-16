/**
 * URL-related utility functions for media handling
 */

/**
 * Ensure a URL is fully qualified (not a relative path)
 */
export function ensureFullUrl(url: string): string {
  if (!url) return '';
  
  // Check if the URL is already absolute
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Handle relative URLs that start with /
  if (url.startsWith('/')) {
    return `${window.location.origin}${url}`;
  }
  
  // For any other case, assume it's relative to the current path
  return `${window.location.origin}/${url}`;
}

/**
 * Add a cache buster to a URL to prevent caching
 */
export function addCacheBuster(url: string): string {
  if (!url) return '';
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
}

/**
 * Get a playable media URL
 */
export function getPlayableMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  
  // Ensure the URL is fully qualified
  const fullUrl = ensureFullUrl(url);
  
  // Handle special cases for different media hosts
  if (fullUrl.includes('youtube.com') || fullUrl.includes('youtu.be')) {
    // Convert YouTube URLs to embedded format
    const videoId = extractYouTubeVideoId(fullUrl);
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&mute=1`;
    }
  }
  
  return fullUrl;
}

/**
 * Extract YouTube video ID from various YouTube URL formats
 */
function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  
  // Handle youtu.be URLs
  if (url.includes('youtu.be')) {
    const parts = url.split('/');
    return parts[parts.length - 1].split('?')[0];
  }
  
  // Handle youtube.com URLs
  const urlParams = new URLSearchParams(url.split('?')[1] || '');
  return urlParams.get('v');
}

/**
 * Check if a URL is accessible
 */
export async function checkUrlAccessibility(url: string): Promise<{
  accessible: boolean;
  error: string | null;
}> {
  try {
    // Only check for existence, don't download the full resource
    const response = await fetch(url, { 
      method: 'HEAD',
      cache: 'no-store'
    });
    
    return {
      accessible: response.ok,
      error: response.ok ? null : `HTTP error ${response.status}`
    };
  } catch (error: any) {
    return {
      accessible: false,
      error: error.message || 'Network error checking URL'
    };
  }
}

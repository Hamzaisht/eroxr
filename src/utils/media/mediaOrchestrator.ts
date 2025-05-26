
/**
 * Media orchestrator utilities for validating and processing media URLs
 */

/**
 * Check if a media URL is valid - very permissive version
 */
export function isValidMediaUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  
  try {
    // Basic URL validation
    const urlObj = new URL(url);
    
    // Check if it's not an empty string or just whitespace
    if (url.trim().length === 0) return false;
    
    // Must be HTTP/HTTPS or data URL
    const protocol = urlObj.protocol;
    if (!['http:', 'https:', 'data:'].includes(protocol)) return false;
    
    // Always allow Supabase storage URLs regardless of extension
    if (url.includes('supabase.co') || url.includes('storage/v1/object')) {
      return true;
    }
    
    // Allow blob URLs for local previews
    if (url.startsWith('blob:')) {
      return true;
    }
    
    // Allow data URLs
    if (url.startsWith('data:')) {
      return true;
    }
    
    // Check for common media file extensions (very permissive)
    const hasMediaExtension = /\.(jpg|jpeg|png|gif|webp|svg|avif|mp4|webm|mov|avi|mp3|wav|ogg|aac|m4v|3gp|flv|mkv|wmv)($|\?)/i.test(url);
    
    // If no extension, still allow if it looks like a valid URL
    return hasMediaExtension || urlObj.pathname.length > 1;
  } catch (error) {
    console.warn('URL validation failed for:', url, error);
    return false;
  }
}

/**
 * Process media URL for better compatibility
 */
export function processMediaUrl(url: string): string {
  if (!url) return '';
  
  // Don't modify data URLs or blob URLs
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  
  // For Supabase storage URLs, ensure they're properly formatted
  if (url.includes('supabase.co/storage/') || url.includes('storage/v1/object/')) {
    // Remove any existing cache busting to avoid double parameters
    const cleanUrl = url.split('?')[0];
    return cleanUrl;
  }
  
  // For other URLs, add light cache busting
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${Date.now()}`;
}

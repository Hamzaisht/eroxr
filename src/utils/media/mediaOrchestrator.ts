
/**
 * Media orchestrator utilities for validating and processing media URLs
 */

/**
 * Check if a media URL is valid - simplified version
 */
export function isValidMediaUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  
  try {
    // Basic URL validation
    new URL(url);
    
    // Check if it's not an empty string or just whitespace
    if (url.trim().length === 0) return false;
    
    // Must be HTTP/HTTPS
    const isHttpUrl = url.startsWith('http://') || url.startsWith('https://');
    if (!isHttpUrl) return false;
    
    // Allow Supabase storage URLs without extension check
    const isSupabaseStorage = url.includes('supabase.co/storage/') || url.includes('storage/v1/object/');
    if (isSupabaseStorage) return true;
    
    // Check for common media file extensions
    const isValidExtension = /\.(jpg|jpeg|png|gif|webp|svg|mp4|webm|mov|avi|mp3|wav|ogg|aac)($|\?)/i.test(url);
    
    return isValidExtension;
  } catch (error) {
    return false;
  }
}

/**
 * Process media URL for better compatibility - simplified
 */
export function processMediaUrl(url: string): string {
  if (!url) return '';
  
  // For Supabase storage URLs, don't add cache busting as it may cause issues
  if (url.includes('supabase.co/storage/') || url.includes('storage/v1/object/')) {
    return url;
  }
  
  // Add cache busting for other URLs
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
}


/**
 * Media orchestrator utilities for validating and processing media URLs
 */

/**
 * Check if a media URL is valid
 */
export function isValidMediaUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  
  try {
    // Basic URL validation
    new URL(url);
    
    // Check if it's not an empty string or just whitespace
    if (url.trim().length === 0) return false;
    
    // Allow common media file extensions and Supabase storage URLs
    const isValidExtension = /\.(jpg|jpeg|png|gif|webp|svg|mp4|webm|mov|avi|mp3|wav|ogg|aac)($|\?)/i.test(url);
    const isSupabaseStorage = url.includes('supabase.co/storage/') || url.includes('storage/v1/object/');
    const isHttpUrl = url.startsWith('http://') || url.startsWith('https://');
    
    return isHttpUrl && (isValidExtension || isSupabaseStorage);
  } catch (error) {
    return false;
  }
}

/**
 * Process media URL for better compatibility
 */
export function processMediaUrl(url: string): string {
  if (!url) return '';
  
  // Add cache busting for better reliability
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
}

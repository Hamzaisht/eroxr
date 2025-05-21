
import { MediaType, MediaSource } from './types';

/**
 * Validates if a media URL is properly formatted
 * @param url URL string to validate
 * @returns boolean
 */
export function isValidMediaUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  
  try {
    // Basic URL validation
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
    const isValidFormat = urlPattern.test(url);
    
    // Check if it's a Supabase storage URL
    const isSupabaseUrl = url.includes('storage/v1/object');
    
    // Handle data URLs (base64)
    const isDataUrl = url.startsWith('data:');
    
    // Handle blob URLs
    const isBlobUrl = url.startsWith('blob:');
    
    return isValidFormat || isSupabaseUrl || isDataUrl || isBlobUrl;
  } catch (error) {
    console.error("Error validating media URL:", error);
    return false;
  }
}

/**
 * Get a playable media URL
 * @param url Input URL
 * @returns Processed URL ready for playback
 */
export function getPlayableMediaUrl(url: string): string {
  if (!url) return '';
  
  try {
    // Return the original URL if it's valid
    if (isValidMediaUrl(url)) {
      // If it's a storage URL and doesn't have cache busting, add it
      if (url.includes('storage/v1/object') && !url.includes('?t=')) {
        const separator = url.includes('?') ? '&' : '?';
        const timestamp = Date.now();
        return `${url}${separator}t=${timestamp}`;
      }
      return url;
    }
    
    // Log invalid URLs but return them anyway to allow the player to handle errors
    console.warn('Invalid media URL format:', url);
    return url;
  } catch (error) {
    console.error("Error processing media URL:", error);
    return url;
  }
}

/**
 * Checks if a media item is accessible to the current user
 * @param mediaItem Media item to check
 * @returns boolean
 */
export async function canAccessMedia(mediaItem: MediaSource): Promise<boolean> {
  if (!mediaItem?.url) return false;
  
  // Public media is always accessible
  if (!mediaItem.access_level || mediaItem.access_level === 'public') {
    return true;
  }
  
  // For other access levels, we assume that the RLS policies will handle access
  // and the URL will only be valid if the user has access
  try {
    const response = await fetch(mediaItem.url, { 
      method: 'HEAD',
      cache: 'no-cache'
    });
    
    return response.ok;
  } catch (error) {
    console.error('Media access check failed:', error);
    return false;
  }
}

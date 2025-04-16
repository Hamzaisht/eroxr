
import { MediaSource } from './types';
import { extractMediaUrl } from './mediaUtils';

/**
 * Process a media URL or source object into a playable URL.
 * Handles various source formats and ensures the URL is valid for display.
 */
export function getPlayableMediaUrl(source: MediaSource | string | null | undefined): string {
  if (!source) return '';
  
  // Extract the URL from a source object or use the string directly
  const url = extractMediaUrl(source);
  
  if (!url) return '';
  
  // Handle special Supabase storage URLs
  if (url.includes('storage/v1/object/public')) {
    // The URL is already public and playable
    return url;
  }
  
  // Handle YouTube URLs
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    // Convert to embedded format if needed
    if (url.includes('watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  }
  
  // Handle Vimeo URLs
  if (url.includes('vimeo.com')) {
    // Convert to embedded format if needed
    const vimeoId = url.split('vimeo.com/')[1];
    if (vimeoId) {
      return `https://player.vimeo.com/video/${vimeoId}`;
    }
    return url;
  }
  
  // Return the processed URL
  return url;
}

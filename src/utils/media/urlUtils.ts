
import { MediaSource } from './types';

/**
 * Extract the media URL from a MediaSource object or string
 */
export function extractMediaUrl(source: MediaSource | string): string | null {
  if (typeof source === 'string') {
    return source;
  }
  
  // Try to get the URL from different possible properties
  const url = source.url || source.video_url || source.media_url || source.src;
  
  return url || null;
}

/**
 * Get a playable media URL by handling special cases
 */
export function getPlayableMediaUrl(url: string): string {
  // Handle special URL types or transformations here
  
  // Handle Supabase URLs
  if (url.includes('storage.googleapis.com') && !url.includes('token=')) {
    // This is a likely public Supabase URL, leave it as is
    return url;
  }
  
  return url;
}

/**
 * Add a cache buster to a URL
 */
export function addCacheBuster(url: string): string {
  if (!url) return url;
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
}

/**
 * Convert a relative URL to an absolute URL
 */
export function toAbsoluteUrl(url: string): string {
  if (!url) return url;
  
  // If already absolute, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Handle relative URLs
  const baseUrl = window.location.origin;
  
  if (url.startsWith('/')) {
    return `${baseUrl}${url}`;
  }
  
  return `${baseUrl}/${url}`;
}

/**
 * Check if URL exists and is accessible
 */
export async function checkUrlExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

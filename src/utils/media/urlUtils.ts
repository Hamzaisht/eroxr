
import { v4 as uuidv4 } from 'uuid';

// Get file extension from a URL or file path
export const getFileExtension = (url: string): string => {
  const parts = url.split('.');
  return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
};

// Add a cache buster to a URL to prevent caching
export const addCacheBuster = (url: string): string => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}cache=${uuidv4().substring(0, 8)}`;
};

// Convert a relative URL to an absolute URL
export const getAbsoluteUrl = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  
  // Using the current origin
  return `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
};

// Get a playable media URL, possibly converting or proxying if needed
export const getPlayableMediaUrl = (url: string | null): string => {
  if (!url) return '';
  
  // For direct links to videos that might need special handling
  const extension = getFileExtension(url);
  
  // Special case for m3u8 (HLS) files
  if (extension === 'm3u8') {
    // These typically need to be played with a compatible player
    return url;
  }
  
  // For video formats that need special handling
  if (['mp4', 'webm', 'mov', 'avi'].includes(extension)) {
    // We can add specific handling here if needed
    return url;
  }
  
  // Default case
  return url;
};

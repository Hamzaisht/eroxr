
/**
 * Utility functions for handling media URLs
 */
import { MediaSource } from './types';
import { extractMediaUrl } from './mediaUtils';

/**
 * Gets the file extension from a URL or path
 */
export function getFileExtension(url: string): string | null {
  if (!url) return null;
  
  // Extract filename from URL or path
  const filename = url.split('/').pop() || '';
  
  // Extract extension
  const parts = filename.split('.');
  if (parts.length <= 1) return null;
  
  return parts.pop()?.toLowerCase() || null;
}

/**
 * Checks if a URL is an image URL based on extension
 */
export function isImageUrl(url: string): boolean {
  const extension = getFileExtension(url);
  if (!extension) return false;
  
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff'];
  return imageExtensions.includes(extension);
}

/**
 * Checks if a URL is a video URL based on extension
 */
export function isVideoUrl(url: string): boolean {
  const extension = getFileExtension(url);
  if (!extension) return false;
  
  const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'wmv', 'flv', 'mkv'];
  return videoExtensions.includes(extension);
}

/**
 * Checks if a URL is an audio URL based on extension
 */
export function isAudioUrl(url: string): boolean {
  const extension = getFileExtension(url);
  if (!extension) return false;
  
  const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a', 'wma'];
  return audioExtensions.includes(extension);
}

/**
 * Transforms URL for playback if needed (e.g., CDN optimizations, etc.)
 * Enhanced to accept both string URLs and MediaSource objects
 */
export function getPlayableMediaUrl(urlOrSource: string | MediaSource | null | undefined): string | null {
  // Handle null or undefined
  if (!urlOrSource) {
    console.warn("getPlayableMediaUrl called with null or undefined value");
    return null;
  }
  
  let url: string | null = null;
  
  // Extract URL from MediaSource object if needed
  if (typeof urlOrSource === 'object') {
    // Try to find a usable URL in the MediaSource object
    url = urlOrSource.video_url || 
          urlOrSource.media_url || 
          urlOrSource.url || 
          urlOrSource.src ||
          (urlOrSource.video_urls && urlOrSource.video_urls.length > 0 ? urlOrSource.video_urls[0] : null) ||
          (urlOrSource.media_urls && urlOrSource.media_urls.length > 0 ? urlOrSource.media_urls[0] : null);
    
    console.log("MediaSource object parsed in getPlayableMediaUrl:", { 
      original: urlOrSource, 
      extractedUrl: url 
    });
  } else {
    // It's already a string URL
    url = urlOrSource;
  }
  
  // If we couldn't extract a URL, return null
  if (!url) {
    console.warn("Could not extract URL from:", urlOrSource);
    return null;
  }
  
  // Debug log
  console.log("Processing URL in getPlayableMediaUrl:", url);
  
  // Make sure URL is properly formatted with protocol
  if (url.startsWith('//')) {
    url = `https:${url}`;
    console.log("Added https protocol to URL:", url);
  }
  
  // Add protocol if missing
  if (!url.startsWith('http') && !url.startsWith('blob:') && !url.startsWith('data:')) {
    url = `https://${url}`;
    console.log("Added https:// protocol to URL:", url);
  }
  
  // Add cache-busting parameter to avoid caching issues
  const separator = url.includes('?') ? '&' : '?';
  const cacheBuster = `cb=${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const finalUrl = `${url}${separator}${cacheBuster}`;
  
  console.log("Final playable URL:", finalUrl);
  return finalUrl;
}

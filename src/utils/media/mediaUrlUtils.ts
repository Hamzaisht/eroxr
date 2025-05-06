
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

// Stable cache for URL processing to prevent excessive re-renders
const processedUrlCache = new Map<string, string>();
const urlContentHashMap = new Map<string, number>();
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

/**
 * Creates a more stable hash for a URL to use as part of the cache key
 */
function getUrlContentHash(url: string): number {
  if (urlContentHashMap.has(url)) {
    return urlContentHashMap.get(url)!;
  }
  
  // Create a simple numeric hash
  const hash = url.split('').reduce((acc, char, index) => {
    return acc + char.charCodeAt(0) * (index + 1);
  }, 0);
  
  urlContentHashMap.set(url, hash);
  return hash;
}

/**
 * Transforms URL for playback with stable cache-busting
 * Enhanced to accept both string URLs and MediaSource objects
 */
export function getPlayableMediaUrl(urlOrSource: string | MediaSource | null | undefined): string | null {
  // Handle null or undefined
  if (!urlOrSource) {
    return null;
  }
  
  let url: string | null = null;
  let cacheKey: string;
  
  // Extract URL from MediaSource object if needed
  if (typeof urlOrSource === 'object') {
    // Try to find a usable URL in the MediaSource object
    url = urlOrSource.video_url || 
          urlOrSource.media_url || 
          urlOrSource.url || 
          urlOrSource.src ||
          (urlOrSource.video_urls && urlOrSource.video_urls.length > 0 ? urlOrSource.video_urls[0] : null) ||
          (urlOrSource.media_urls && urlOrSource.media_urls.length > 0 ? urlOrSource.media_urls[0] : null);
    
    // Generate a stable cache key from the object
    cacheKey = url || JSON.stringify(urlOrSource);
  } else {
    // It's already a string URL
    url = urlOrSource;
    cacheKey = url;
  }
  
  // If we couldn't extract a URL, return null
  if (!url) {
    return null;
  }
  
  // Check cache first to prevent reprocessing the same URL
  if (processedUrlCache.has(cacheKey)) {
    return processedUrlCache.get(cacheKey) || null;
  }
  
  // Make sure URL is properly formatted with protocol
  if (url.startsWith('//')) {
    url = `https:${url}`;
  }
  
  // Add protocol if missing
  if (!url.startsWith('http') && !url.startsWith('blob:') && !url.startsWith('data:')) {
    url = `https://${url}`;
  }
  
  // Add stable cache-busting parameter that won't change on every render
  // Generate a stable hash based on the URL's content
  const contentHash = getUrlContentHash(url);
  
  // Use a stable hour-based timestamp (changes only once per hour)
  const hourTimestamp = Math.floor(Date.now() / CACHE_DURATION);
  
  const separator = url.includes('?') ? '&' : '?';
  const cacheBuster = `cb=${hourTimestamp}-${contentHash}`;
  const finalUrl = `${url}${separator}${cacheBuster}`;
  
  // Store in cache
  processedUrlCache.set(cacheKey, finalUrl);
  
  return finalUrl;
}

/**
 * Adds a cache busting parameter to a URL
 * @param url - The URL to add the cache buster to
 * @returns The URL with a cache buster parameter
 */
export function addCacheBuster(url: string): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}cb=${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Creates a URL for a file object
 * @param file - The file to create a URL for
 * @returns A URL for the file
 */
export function createObjectUrl(file: File | Blob): string {
  return URL.createObjectURL(file);
}

/**
 * Revokes a URL created with URL.createObjectURL
 * @param url - The URL to revoke
 */
export function revokeObjectUrl(url: string): void {
  URL.revokeObjectURL(url);
}


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

// Cache for URL processing to prevent excessive re-rendering
const processedUrlCache = new Map<string, string>();
const processingTimestamps = new Map<string, number>();
const CACHE_EXPIRY = 300000; // 5 minutes in milliseconds

/**
 * Transforms URL for playback if needed (e.g., CDN optimizations, etc.)
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
    const timestamp = processingTimestamps.get(cacheKey) || 0;
    // Only use cache if it hasn't expired
    if (Date.now() - timestamp < CACHE_EXPIRY) {
      return processedUrlCache.get(cacheKey) || null;
    }
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
  // Use the current hour as part of the cache buster to balance caching and freshness
  const currentHour = Math.floor(Date.now() / 3600000);
  const stableId = cacheKey.split('').reduce((a, b) => {
    return a + b.charCodeAt(0);
  }, 0);
  
  const separator = url.includes('?') ? '&' : '?';
  const cacheBuster = `cb=${currentHour}-${stableId}`;
  const finalUrl = `${url}${separator}${cacheBuster}`;
  
  // Store in cache
  processedUrlCache.set(cacheKey, finalUrl);
  processingTimestamps.set(cacheKey, Date.now());
  
  return finalUrl;
}

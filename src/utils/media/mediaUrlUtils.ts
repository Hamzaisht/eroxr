
/**
 * Utility functions for handling media URLs
 */
import { MediaSource } from './types';
import { extractMediaUrl } from './mediaUtils';
import { mediaOrchestrator } from './mediaOrchestrator';

/**
 * Gets the file extension from a URL or path
 */
export function getFileExtension(url: string): string | null {
  if (!url) return null;
  
  try {
    // Handle data URIs separately
    if (url.startsWith('data:')) {
      const match = url.match(/data:([a-z]+)\/([a-z0-9.+-]+);/i);
      return match ? match[2].toLowerCase() : null;
    }

    // Extract filename from URL or path and handle query params
    const urlWithoutParams = url.split('?')[0];
    const filename = urlWithoutParams.split('/').pop() || '';
    
    // Extract extension
    const parts = filename.split('.');
    if (parts.length <= 1) return null;
    
    return parts.pop()?.toLowerCase() || null;
  } catch (error) {
    console.error("Error getting file extension:", error);
    return null;
  }
}

/**
 * Checks if a URL is an image URL based on extension
 */
export function isImageUrl(url: string): boolean {
  if (!url) return false;
  
  // Handle data URIs
  if (url.startsWith('data:image/')) return true;
  
  const extension = getFileExtension(url);
  if (!extension) return false;
  
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff'];
  return imageExtensions.includes(extension);
}

/**
 * Checks if a URL is a video URL based on extension
 */
export function isVideoUrl(url: string): boolean {
  if (!url) return false;
  
  // Handle data URIs
  if (url.startsWith('data:video/')) return true;
  
  const extension = getFileExtension(url);
  if (!extension) return false;
  
  const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'wmv', 'flv', 'mkv'];
  return videoExtensions.includes(extension);
}

/**
 * Checks if a URL is an audio URL based on extension
 */
export function isAudioUrl(url: string): boolean {
  if (!url) return false;
  
  // Handle data URIs
  if (url.startsWith('data:audio/')) return true;
  
  const extension = getFileExtension(url);
  if (!extension) return false;
  
  const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a', 'wma'];
  return audioExtensions.includes(extension);
}

/**
 * Transforms URL for playback with stable cache-busting
 * Enhanced to use the global media orchestrator for stable references
 */
export function getPlayableMediaUrl(urlOrSource: string | MediaSource | null | undefined): string | null {
  // Use the orchestrator to get a stable URL
  return mediaOrchestrator.getStableUrl(urlOrSource);
}

/**
 * Adds a cache busting parameter to a URL using a stable hash
 * @param url - The URL to add the cache buster to
 * @returns The URL with a cache buster parameter
 */
export function addCacheBuster(url: string): string {
  try {
    // Generate a more stable cache buster that doesn't change on every reload
    const hourTimestamp = Math.floor(Date.now() / 3600000); // Changes only once per hour
    const contentHash = url
      .split('')
      .reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) & 0xFFFFFFFF, 0)
      .toString(36);
      
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}cb=${hourTimestamp}-${contentHash}`;
  } catch (error) {
    console.error("Error adding cache buster:", error);
    return url;
  }
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
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}


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

// Constants for cache management
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

/**
 * Transforms URL for playback with stable cache-busting
 * Enhanced to use the global media orchestrator for stable references
 */
export function getPlayableMediaUrl(urlOrSource: string | MediaSource | null | undefined): string | null {
  // Use the orchestrator to get a stable URL
  return mediaOrchestrator.getStableUrl(urlOrSource);
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

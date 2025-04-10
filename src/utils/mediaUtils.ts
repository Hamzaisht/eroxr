
import { Story } from "@/integrations/supabase/types/story";
import { buildStorageUrl } from "./media/getPlayableMediaUrl";

/**
 * Gets the appropriate content type from a story object
 */
export const getContentType = (story: Story): 'video' | 'image' => {
  // First check explicit content_type field
  if (story.content_type === 'video') return 'video';
  if (story.media_type === 'video') return 'video';
  
  // Then check for video URL existence
  if (story.video_url) return 'video';
  
  // Default to image for all other cases
  return 'image';
};

/**
 * Gets the appropriate media URL from a story object
 */
export const getMediaUrl = (story: Story): string | null => {
  // First check for video URL if it's a video
  if (getContentType(story) === 'video' && story.video_url) {
    // Handle full URLs vs storage paths
    if (story.video_url.startsWith("http")) {
      return story.video_url;
    } else {
      return buildStorageUrl('videos', story.video_url);
    }
  }
  
  // Then try media_url
  if (story.media_url) {
    if (story.media_url.startsWith("http")) {
      return story.media_url;
    } else {
      return buildStorageUrl('media', story.media_url);
    }
  }
  
  return null;
};

/**
 * Fixes broken storage URLs that might be missing parts of the path
 */
export const fixBrokenStorageUrl = (url: string): string => {
  if (!url) return url;
  
  // If already a proper URL, return as is
  if (url.startsWith("http")) return url;
  
  // If this is a path, build the storage URL
  if (url.includes('/')) {
    const parts = url.split('/');
    const bucket = parts[0];
    const path = parts.slice(1).join('/');
    return buildStorageUrl(bucket, path);
  }
  
  // Default to media bucket if unclear
  return buildStorageUrl('media', url);
};

/**
 * Adds a cache busting parameter to prevent browser caching
 */
export const getUrlWithCacheBuster = (url: string | null): string | null => {
  if (!url) return null;
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}cache=${Date.now()}`;
};

/**
 * Refreshes a URL with a new cache buster to force reloading
 */
export const refreshUrl = (url: string | null): string | null => {
  if (!url) return null;
  
  // Remove any existing cache param
  let cleanUrl = url;
  if (cleanUrl.includes('cache=')) {
    cleanUrl = cleanUrl.split('cache=')[0];
    if (cleanUrl.endsWith('?') || cleanUrl.endsWith('&')) {
      cleanUrl = cleanUrl.slice(0, -1);
    }
  }
  
  // Add new cache buster
  return getUrlWithCacheBuster(cleanUrl);
};

/**
 * Creates a unique file path for upload
 */
export const createUniqueFilePath = (userId: string, fileName: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  const fileExt = fileName.split('.').pop() || 'file';
  
  return `${userId}/${timestamp}_${randomString}.${fileExt}`;
};

/**
 * Gets complete storage URL from bucket and path
 */
export const getStorageUrl = (bucket: string, path?: string): string => {
  if (!path) return '';
  return buildStorageUrl(bucket, path);
};

/**
 * Add a cache buster to a URL
 */
export const addCacheBuster = (url: string | null): string | null => {
  return getUrlWithCacheBuster(url);
};

/**
 * Re-export the getPlayableMediaUrl function to maintain compatibility
 */
export { getPlayableMediaUrl } from "./media/getPlayableMediaUrl";

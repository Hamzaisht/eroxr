
import { supabase } from "@/integrations/supabase/client";

/**
 * Creates a proper playable media URL from various potential sources
 * Handles both full URLs and storage paths
 */
export const getPlayableMediaUrl = (item: {
  video_url?: string | null;
  media_url?: string | null;
  content_type?: string;
  media_type?: string;
}): string | null => {
  // First check for direct full URLs
  if (item?.video_url && item.video_url.startsWith("http")) {
    return item.video_url;
  }
  
  if (item?.media_url && item.media_url.startsWith("http")) {
    return item.media_url;
  }
  
  // Handle array of media URLs
  if (Array.isArray(item.media_url) && item.media_url.length > 0) {
    const firstMediaUrl = item.media_url[0];
    if (firstMediaUrl && firstMediaUrl.startsWith("http")) {
      return firstMediaUrl;
    }
    // Handle path in the array
    if (firstMediaUrl) {
      return buildStorageUrl("media", firstMediaUrl);
    }
  }
  
  // Handle storage paths for video
  if (item?.video_url) {
    return buildStorageUrl("media", item.video_url);
  }
  
  // Handle storage paths for media
  if (item?.media_url) {
    return buildStorageUrl("media", item.media_url);
  }
  
  return null;
};

/**
 * Builds a complete storage URL from a path
 */
export const buildStorageUrl = (bucket: string, path: string): string => {
  // Don't rebuild if it's already a full URL
  if (path.startsWith("http")) {
    return path;
  }
  
  // Remove leading slashes if present
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;
  
  // Get the storage URL from supabase client
  const { data } = supabase.storage.from(bucket).getPublicUrl(cleanPath);
  
  return data.publicUrl;
};

/**
 * Add a cache buster to a URL to prevent caching issues
 */
export const addCacheBuster = (url: string | null): string | null => {
  if (!url) return null;
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}cache=${Date.now()}`;
};

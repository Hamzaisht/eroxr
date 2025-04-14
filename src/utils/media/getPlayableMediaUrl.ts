
import { supabase } from "@/integrations/supabase/client";

/**
 * Extract a usable URL from various media object formats or string
 */
export function getPlayableMediaUrl(media: any): string {
  // If null or undefined, return empty string
  if (!media) return '';
  
  // If it's already a string URL
  if (typeof media === 'string') {
    return ensureFullUrl(media);
  }
  
  // Extract URL from object based on common properties
  const url = 
    media.video_url || 
    (Array.isArray(media.video_urls) && media.video_urls.length > 0 ? media.video_urls[0] : null) ||
    media.media_url ||
    (Array.isArray(media.media_url) && media.media_url.length > 0 ? media.media_url[0] : null) ||
    media.url ||
    '';
  
  return ensureFullUrl(url);
}

/**
 * Process a partial URL into a full, playable URL
 * Handles Supabase Storage URLs, external URLs, and relative paths
 */
export function ensureFullUrl(url: string): string {
  if (!url) return '';
  
  // Already a complete URL or data URL - return as is
  if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  
  // Remove leading slash if present
  const cleanPath = url.startsWith('/') ? url.substring(1) : url;
  
  // Determine the bucket from the path
  let bucket = 'media';
  const possibleBuckets = ['stories', 'posts', 'videos', 'avatars', 'media', 'shorts'];
  
  for (const b of possibleBuckets) {
    if (cleanPath.startsWith(`${b}/`) || cleanPath.includes(`/${b}/`)) {
      bucket = b;
      break;
    }
  }
  
  try {
    // Get public URL from Supabase storage
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(cleanPath);
    
    return data?.publicUrl || '';
  } catch (error) {
    console.error(`Failed to get URL for ${url}:`, error);
    
    // Try all buckets as fallback
    for (const fallbackBucket of possibleBuckets) {
      if (fallbackBucket === bucket) continue;
      
      try {
        const { data } = supabase.storage
          .from(fallbackBucket)
          .getPublicUrl(cleanPath);
        
        if (data?.publicUrl) {
          return data.publicUrl;
        }
      } catch (fallbackError) {
        // Ignore fallback errors
      }
    }
    
    return '';
  }
}

/**
 * Determine if a media item is video content
 */
export function isVideoContent(item: any): boolean {
  // Check direct video properties
  if (typeof item === 'object') {
    if (item.video_url || item.video_urls || item.content_type === 'video' || 
        item.media_type === 'video') {
      return true;
    }
  }
  
  // Check by file extension for string URLs
  const url = typeof item === 'string' ? item : 
              (item?.media_url || item?.url || '');
              
  if (typeof url === 'string') {
    const extension = url.split('.').pop()?.toLowerCase() || '';
    const videoExtensions = ['mp4', 'webm', 'mov', 'avi', 'wmv', 'flv', 'mkv'];
    return videoExtensions.includes(extension);
  }
  
  return false;
}


import { supabase } from "@/integrations/supabase/client";

/**
 * Get the playable media URL from various sources
 * @param media A media item (object or string URL)
 * @returns The fully qualified URL
 */
export function getPlayableMediaUrl(media: any): string {
  if (!media) return '';

  // If it's already a string URL
  if (typeof media === 'string') {
    return ensureFullUrl(media);
  }

  // Extract URL from object based on common properties
  const url = 
    media.video_url || 
    (Array.isArray(media.video_urls) && media.video_urls.length > 0 ? media.video_urls[0] : null) ||
    (typeof media.media_url === 'string' ? media.media_url : null) ||
    (Array.isArray(media.media_url) && media.media_url.length > 0 ? media.media_url[0] : null) ||
    media.url ||
    '';

  return ensureFullUrl(url);
}

/**
 * Ensure the URL is a complete, usable URL
 */
export function ensureFullUrl(url: string): string {
  if (!url) return '';
  
  // If already a complete URL or a data/blob URL, return as is
  if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  
  // If it starts with a slash, remove it
  const cleanPath = url.startsWith('/') ? url.substring(1) : url;
  
  // Try to determine the bucket from the path
  let bucket = 'media';
  const possibleBuckets = ['stories', 'posts', 'videos', 'avatars', 'media', 'shorts'];
  
  for (const b of possibleBuckets) {
    if (cleanPath.startsWith(`${b}/`) || cleanPath.includes(`/${b}/`)) {
      bucket = b;
      break;
    }
  }
  
  // Get the public URL using Supabase
  try {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(cleanPath);
    
    return data?.publicUrl || '';
  } catch (error) {
    console.error(`Failed to get public URL for ${url}:`, error);
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

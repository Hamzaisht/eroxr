
import { supabase } from "@/integrations/supabase/client";
import { extractMediaUrl, getDirectMediaUrl, addCacheBuster } from "./mediaUrlUtils";

/**
 * Get the playable media URL from various sources
 * @param media A media item (object or string URL)
 * @returns The fully qualified URL
 */
export function getPlayableMediaUrl(media: any): string {
  if (!media) return '';

  // Extract the basic URL
  let url = '';
  
  // If it's already a string URL
  if (typeof media === 'string') {
    url = media;
  } else {
    // Extract URL from object based on common properties (video_url, video_urls, media_url, etc.)
    url = media.video_url || 
      (Array.isArray(media.video_urls) && media.video_urls.length > 0 ? media.video_urls[0] : null) ||
      (typeof media.media_url === 'string' ? media.media_url : null) ||
      (Array.isArray(media.media_url) && media.media_url.length > 0 ? media.media_url[0] : null) ||
      media.url ||
      '';
  }

  return ensureFullUrl(url);
}

/**
 * Ensure the URL is a complete, usable URL
 */
export function ensureFullUrl(url: string): string {
  if (!url) return '';
  
  // If already a complete URL or a data/blob URL, return with cache busting
  if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url.startsWith('data:') || url.startsWith('blob:') ? url : addCacheBuster(url);
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
    console.log(`Getting public URL for ${bucket}/${cleanPath}`);
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(cleanPath);
    
    const publicUrl = data?.publicUrl || '';
    
    if (publicUrl) {
      const finalUrl = addCacheBuster(publicUrl);
      console.log(`Generated URL: ${finalUrl}`);
      return finalUrl;
    }
    
    return '';
  } catch (error) {
    console.error(`Failed to get public URL for ${url}:`, error);
    
    // Try all buckets as a last resort
    for (const fallbackBucket of possibleBuckets) {
      if (fallbackBucket === bucket) continue; // Skip the one we already tried
      
      try {
        console.log(`Trying fallback bucket ${fallbackBucket} for ${cleanPath}`);
        const { data } = supabase.storage.from(fallbackBucket).getPublicUrl(cleanPath);
        if (data?.publicUrl) {
          return addCacheBuster(data.publicUrl);
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

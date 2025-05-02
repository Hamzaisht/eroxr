
import { supabase } from "@/integrations/supabase/client";
import { MediaSource } from "./types";

/**
 * Processes a media URL to ensure it's playable in browsers
 * Handles various URL formats including Supabase storage URLs
 */
export function getPlayableMediaUrl(url: string | MediaSource | null): string {
  if (!url) return '';
  
  // Handle MediaSource object
  if (typeof url !== 'string') {
    const mediaUrl = url.media_url || url.video_url || url.url || '';
    return getPlayableMediaUrl(mediaUrl);
  }
  
  // Already a data URL or blob URL
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  // If it's already a proper URL, add cache busting
  if (url.startsWith('http')) {
    return addCacheBuster(url);
  }
  
  // Handle potential storage paths
  if (url.includes('/')) {
    // Try to extract bucket and path
    const parts = url.split('/');
    const possibleBuckets = ['shorts', 'videos', 'stories', 'media', 'messages', 'posts'];
    
    // Check if the first part is a recognized bucket
    if (possibleBuckets.includes(parts[0])) {
      const bucket = parts[0];
      const objectPath = parts.slice(1).join('/');
      
      try {
        const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
        if (data.publicUrl) {
          return addCacheBuster(data.publicUrl);
        }
      } catch (e) {
        console.error(`Failed to get public URL for ${bucket}/${objectPath}:`, e);
      }
    }
  }
  
  // Default: return the URL as-is with cache buster
  return addCacheBuster(url);
}

/**
 * Adds a cache buster to a URL to prevent caching issues
 */
export function addCacheBuster(url: string): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}cb=${Date.now()}`;
}

/**
 * Gets the appropriate video poster image for a video URL
 */
export function getVideoPoster(videoUrl: string | null): string {
  if (!videoUrl) return '';
  
  // TODO: Implement thumbnail generation if needed
  return '';
}

/**
 * Creates a properly formatted URL for media display
 */
export function formatMediaUrl(url: string | MediaSource | null): string {
  return getPlayableMediaUrl(url);
}

/**
 * Extracts file extension from a URL or path
 */
export function getFileExtension(url: string): string | undefined {
  if (!url) return undefined;
  return url.split('.').pop()?.toLowerCase();
}

/**
 * Check if URL points to an image
 */
export function isImageUrl(url: string): boolean {
  const extension = getFileExtension(url);
  return !!extension && ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension);
}

/**
 * Check if URL points to a video
 */
export function isVideoUrl(url: string): boolean {
  const extension = getFileExtension(url);
  return !!extension && ['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(extension);
}

/**
 * Check if URL points to an audio file
 */
export function isAudioUrl(url: string): boolean {
  const extension = getFileExtension(url);
  return !!extension && ['mp3', 'wav', 'ogg', 'aac', 'm4a'].includes(extension);
}

/**
 * Updates metadata for a file in storage
 */
export async function updateFileMetadata(bucket: string, path: string, metadata: Record<string, string>): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .update(path, undefined, {
        upsert: false,
        duplex: 'half',
        contentType: metadata.contentType,
        cacheControl: metadata.cacheControl || '3600',
      });
    
    if (error) {
      console.error('Error updating file metadata:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Exception updating file metadata:', err);
    return false;
  }
}

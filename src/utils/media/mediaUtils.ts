
import { supabase } from "@/integrations/supabase/client";

/**
 * Get a valid media URL from Supabase storage
 */
export const getValidMediaUrl = (storagePath: string): string => {
  if (!storagePath) {
    console.error("MediaUtils - Empty storage path provided");
    return '';
  }
  
  // Clean the path by removing leading slashes
  const cleanPath = storagePath.replace(/^\/+/, '');
  
  // Build the public URL for the media bucket
  const { data } = supabase.storage
    .from('media')
    .getPublicUrl(cleanPath);
  
  const url = data.publicUrl;
  console.log("MediaUtils - Generated URL:", { storagePath, cleanPath, url });
  return url;
};

/**
 * Validate if a media URL is accessible
 */
export const validateMediaUrl = async (url: string): Promise<boolean> => {
  if (!url) return false;
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error("MediaUtils - URL validation failed:", error);
    return false;
  }
};

/**
 * Get media type from MIME type or file extension
 */
export const getMediaType = (mimeType: string, fileName?: string): 'image' | 'video' | 'audio' | 'unknown' => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  
  // Fallback to file extension if MIME type is not clear
  if (fileName) {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) return 'image';
    if (['mp4', 'webm', 'mov', 'avi'].includes(extension || '')) return 'video';
    if (['mp3', 'wav', 'ogg', 'm4a'].includes(extension || '')) return 'audio';
  }
  
  return 'unknown';
};

/**
 * Check if media asset has valid data
 */
export const isValidMediaAsset = (asset: any): boolean => {
  return !!(asset && asset.id && asset.storage_path && asset.media_type);
};

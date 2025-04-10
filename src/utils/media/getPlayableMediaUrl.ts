
import { supabase } from "@/integrations/supabase/client";

/**
 * Creates a proper playable media URL from various potential sources
 * Handles both full URLs and storage paths
 */
export const getPlayableMediaUrl = (item: {
  video_url?: string | null;
  media_url?: string | null;
  url?: string | null;
}): string | null => {
  const url = item?.video_url || item?.media_url || item?.url;
  if (!url || typeof url !== "string") return null;
  
  // If it's already a full URL, return it directly
  if (url.startsWith("http")) return url;
  
  // Get the public URL using Supabase storage
  const { data } = supabase.storage.from('media').getPublicUrl(url);
  
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

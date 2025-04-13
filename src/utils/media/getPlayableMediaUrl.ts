
import { getFirstValidUrl, getStoragePublicUrl } from "./storageUtils";
import { addCacheBuster, checkUrlAccessibility } from "./urlUtils";

/**
 * Generate a playable media URL from an item record.
 * This function handles several different data structures and returns a usable URL.
 */
export const getPlayableMediaUrl = (item: any): string | null => {
  // Handle null or undefined input
  if (!item) return null;

  // Debug info to help identify issues
  console.debug("Getting playable URL for:", item);

  // Handle array of URLs (return first valid one)
  if (item?.media_url && Array.isArray(item.media_url) && item.media_url.length > 0) {
    return getFirstValidUrl(item.media_url);
  }
  
  if (item?.media_urls && Array.isArray(item.media_urls) && item.media_urls.length > 0) {
    return getFirstValidUrl(item.media_urls);
  }
  
  if (item?.video_urls && Array.isArray(item.video_urls) && item.video_urls.length > 0) {
    return getFirstValidUrl(item.video_urls);
  }
  
  // Check for direct URL properties
  const videoUrl = item?.video_url;
  const mediaUrl = item?.media_url;
  const url = item?.url;
  
  // Return the first available URL
  const firstValidUrl = videoUrl || mediaUrl || url;
  
  if (!firstValidUrl) {
    console.debug("No valid media URL found in item:", item);
    return null;
  }
  
  // If it's already a full URL, return it directly
  if (typeof firstValidUrl === 'string') {
    if (firstValidUrl.startsWith('http') || firstValidUrl.startsWith('/api/')) {
      // For Supabase storage URLs, try to add a token if they're protected
      if (firstValidUrl.includes('supabase') && firstValidUrl.includes('/storage/v1/object/')) {
        // Try to use a signed URL for better access
        try {
          // Add a timestamp parameter to avoid caching issues
          const timestamp = new Date().getTime();
          return `${firstValidUrl}${firstValidUrl.includes('?') ? '&' : '?'}t=${timestamp}`;
        } catch (e) {
          console.warn("Error creating signed URL:", e);
          return firstValidUrl;
        }
      }
      
      return firstValidUrl;
    }
    
    // If it's a storage path, get the public URL
    return getStoragePublicUrl(firstValidUrl);
  }
  
  // If we got here and firstValidUrl is not a string, log and return null
  console.warn("Invalid URL type:", typeof firstValidUrl, firstValidUrl);
  return null;
};

// Re-export the functions from other files for easy access
export { addCacheBuster, checkUrlAccessibility } from "./urlUtils";

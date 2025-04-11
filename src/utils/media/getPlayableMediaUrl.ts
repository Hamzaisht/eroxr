
import { getFirstValidUrl, getStoragePublicUrl } from "./storageUtils";

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
      return firstValidUrl;
    }
    
    // If it's a storage path, get the public URL
    return getStoragePublicUrl(firstValidUrl);
  }
  
  // If we got here and firstValidUrl is not a string, log and return null
  console.warn("Invalid URL type:", typeof firstValidUrl, firstValidUrl);
  return null;
};

// Re-export the functions from other files for backward compatibility
export { addCacheBuster, checkUrlAccessibility } from "./urlUtils";
export { getAuthenticatedUrl } from "./storageUtils";

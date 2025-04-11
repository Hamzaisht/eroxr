
/**
 * Determines if a media item or URL should be treated as a video.
 * 
 * @param item - The media item object
 * @param url - The media URL string
 * @returns boolean indicating if the content is a video
 */
export const isVideo = (item: any, url: string | null): boolean => {
  return item?.content_type === "video" || 
         item?.media_type === "video" || 
         (url && (
           url.toLowerCase().endsWith(".mp4") || 
           url.toLowerCase().endsWith(".webm") || 
           url.toLowerCase().endsWith(".mov") ||
           url.includes("video")
         ));
};

/**
 * Extracts the file extension from a URL or path
 * 
 * @param url - The URL to analyze
 * @returns The file extension or null if not found
 */
export const getFileExtension = (url: string): string | null => {
  if (!url) return null;
  
  try {
    // Remove query parameters
    const cleanUrl = url.split('?')[0];
    const matches = cleanUrl.match(/\.([a-zA-Z0-9]+)$/);
    return matches ? matches[1].toLowerCase() : null;
  } catch (e) {
    console.error("Error extracting file extension:", e);
    return null;
  }
};

/**
 * Determines the content type based on URL and item metadata
 * 
 * @param url - The media URL
 * @param item - The media item with metadata
 * @returns The content type string
 */
export const getContentType = (url: string | null, item: any): string => {
  if (!url) return 'unknown';
  
  if (isVideo(item, url)) {
    return 'video';
  }
  
  const extension = getFileExtension(url);
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'].includes(extension || '')) {
    return 'image';
  }
  
  if (['mp3', 'wav', 'ogg', 'aac'].includes(extension || '')) {
    return 'audio';
  }
  
  return 'unknown';
};

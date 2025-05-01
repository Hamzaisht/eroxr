
import { getPlayableMediaUrl as getPlayableUrl } from './media/urlUtils';

/**
 * Helper function to safely get a playable URL from a string or array of strings
 * This can be used throughout the app to handle media URLs correctly
 */
export function getPlayableMediaUrl(url: string | string[] | undefined | null): string {
  if (!url) return '';
  
  if (Array.isArray(url)) {
    return url.length > 0 ? getPlayableUrl(url[0]) : '';
  }
  
  return getPlayableUrl(url);
}

/**
 * Helper function to safely get the first URL from a string or array of strings
 */
export function getFirstUrl(url: string | string[] | undefined | null): string {
  if (!url) return '';
  
  if (Array.isArray(url)) {
    return url.length > 0 ? url[0] : '';
  }
  
  return url;
}

/**
 * Helper function to extract all media URLs from a message
 */
export function extractMediaUrls(message: any): string[] {
  if (!message) return [];
  
  // Look for media_url array
  if (Array.isArray(message.media_url)) {
    return message.media_url;
  }
  
  // Look for media_url string
  if (typeof message.media_url === 'string') {
    return [message.media_url];
  }
  
  // Look for video_url
  if (message.video_url) {
    if (Array.isArray(message.video_url)) {
      return message.video_url;
    } else {
      return [message.video_url];
    }
  }
  
  return [];
}

/**
 * Helper function to determine if a message has media attachments
 */
export function hasMediaAttachment(message: any): boolean {
  return !!(
    message.media_url || 
    message.video_url || 
    message.media_urls?.length || 
    message.video_urls?.length
  );
}

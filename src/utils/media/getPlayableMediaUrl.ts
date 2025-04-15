
/**
 * @deprecated Use getPlayableMediaUrl from @/utils/media/urlUtils instead
 */

import { getPlayableMediaUrl as getMedia } from './urlUtils';
import { MediaSource } from './types';

/**
 * Backward compatibility function for older code
 * Supports both string and MediaSource object parameters
 */
export function getPlayableMediaUrl(url: string | MediaSource | null | undefined): string | null {
  if (!url) return null;
  
  if (typeof url === 'string') {
    return getMedia(url);
  }
  
  // Extract URL from MediaSource object
  const mediaUrl = url.video_url || 
    (Array.isArray(url.video_urls) && url.video_urls.length > 0 ? url.video_urls[0] : null) ||
    url.media_url ||
    (Array.isArray(url.media_urls) && url.media_urls.length > 0 ? url.media_urls[0] : null) ||
    url.url ||
    url.src;
  
  return getMedia(mediaUrl);
}

export default getPlayableMediaUrl;

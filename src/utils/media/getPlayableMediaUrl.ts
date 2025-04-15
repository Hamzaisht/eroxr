
/**
 * @deprecated Use getPlayableMediaUrl from @/utils/media/urlUtils instead
 */

import { getPlayableMediaUrl as getMedia } from './urlUtils';

/**
 * Backward compatibility function for older code
 */
export function getPlayableMediaUrl(url: string | null | undefined): string | null {
  return getMedia(url);
}

export default getPlayableMediaUrl;

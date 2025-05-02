
import { getPlayableUrl } from './mediaUrlUtils';

/**
 * Gets a playable media URL with proper formatting
 * @param url - The URL to process
 * @returns The processed URL ready for playback
 */
export function getPlayableMediaUrl(url: string | undefined | null): string {
  return getPlayableUrl(url);
}

export default getPlayableMediaUrl;

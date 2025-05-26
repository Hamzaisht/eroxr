
import { MediaAccessLevel } from './types';

/**
 * Get playable media URL with proper handling for different access levels
 */
export const getPlayableMediaUrl = (url: string | undefined): string => {
  if (!url) return '';
  
  // Handle URL without protocol
  if (url.startsWith('//')) {
    return `https:${url}`;
  }
  
  // Add protocol if missing
  if (!url.startsWith('http') && !url.startsWith('blob:') && !url.startsWith('data:')) {
    return `https://${url}`;
  }
  
  return url;
};

/**
 * Generate watermark text for media
 */
export const generateWatermark = (creatorHandle?: string): string => {
  if (!creatorHandle) return 'www.eroxr.com';
  return `www.eroxr.com/@${creatorHandle}`;
};

/**
 * Check if media should be blurred based on access level
 */
export const shouldBlurMedia = (
  accessLevel: MediaAccessLevel,
  hasAccess: boolean
): boolean => {
  if (accessLevel === MediaAccessLevel.PUBLIC) return false;
  return !hasAccess;
};

/**
 * Get preview duration for PPV content (in seconds)
 */
export const getPreviewDuration = (accessLevel: MediaAccessLevel): number => {
  switch (accessLevel) {
    case MediaAccessLevel.PPV:
      return 10; // 10 seconds preview
    case MediaAccessLevel.SUBSCRIBERS:
      return 5; // 5 seconds preview
    default:
      return 0;
  }
};

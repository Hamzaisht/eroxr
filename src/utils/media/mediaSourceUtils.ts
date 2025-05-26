
import { MediaType, MediaSource } from '@/types/media';
import { extractMediaUrl, determineMediaType } from './mediaUtils';

/**
 * Processes and validates a media source
 */
export const processMediaSource = (source: any): MediaSource | null => {
  if (!source) return null;
  
  const url = extractMediaUrl(source);
  if (!url) return null;
  
  return {
    url,
    type: source.type || determineMediaType(source),
    thumbnail: source.thumbnail,
    poster: source.poster,
    duration: source.duration,
    width: source.width,
    height: source.height,
    watermark: source.watermark,
    creator_id: source.creator_id,
    content_type: source.content_type,
    media_url: source.media_url,
    video_url: source.video_url,
    thumbnail_url: source.thumbnail_url,
    path: source.path,
    post_id: source.post_id
  };
};

/**
 * Validates if a media source is playable
 */
export const isValidMediaSource = (source: MediaSource): boolean => {
  return !!(source && source.url && source.type !== MediaType.UNKNOWN);
};


import { forwardRef, Ref, useMemo } from 'react';
import { MediaRenderer } from '@/components/media/MediaRenderer';
import { MediaSource, MediaType, MediaOptions } from '@/utils/media/types';
import { extractMediaUrl } from '@/utils/media/mediaUtils';
import { normalizeMediaSource } from '@/utils/media/mediaUtils';

interface UniversalMediaProps extends MediaOptions {
  item: MediaSource | string;
  showWatermark?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  alt?: string;
  maxRetries?: number;
}

export const UniversalMedia = forwardRef(({
  item,
  className = "",
  autoPlay = false,
  controls = true,
  muted = true,
  loop = false,
  poster,
  showWatermark = false,
  onClick,
  onLoad,
  onError,
  onEnded,
  onTimeUpdate,
  objectFit = 'cover',
  alt = "Media content",
  maxRetries = 2
}: UniversalMediaProps, ref: Ref<HTMLVideoElement | HTMLImageElement>) => {
  // Process the item to ensure it has a url property
  const mediaItem = useMemo(() => {
    const normalized = normalizeMediaSource(item);
    // If poster prop was passed, add it to the mediaSource
    if (poster) {
      normalized.poster = poster;
    }
    return normalized;
  }, [item, poster]);

  return (
    <MediaRenderer
      src={mediaItem}
      className={className}
      autoPlay={autoPlay}
      controls={controls}
      muted={muted}
      loop={loop}
      poster={poster || (mediaItem && typeof mediaItem === 'object' && 'poster' in mediaItem ? mediaItem.poster : undefined)}
      showWatermark={showWatermark}
      onClick={onClick}
      onLoad={onLoad}
      onError={onError}
      onEnded={onEnded}
      onTimeUpdate={onTimeUpdate}
      ref={ref}
      allowRetry={true}
      maxRetries={maxRetries}
    />
  );
});

UniversalMedia.displayName = 'UniversalMedia';

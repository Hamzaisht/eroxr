
import { forwardRef, Ref, useMemo } from 'react';
import { MediaRenderer } from './MediaRenderer';
import { MediaType, MediaSource, UniversalMediaProps } from '@/utils/media/types';
import { normalizeMediaSource } from '@/utils/media/mediaUtils';

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
  alt = "Media content",
  maxRetries = 2
}: UniversalMediaProps, ref: Ref<HTMLVideoElement | HTMLImageElement>) => {
  // Process the item to ensure it has a url property
  const mediaItem = useMemo(() => {
    return normalizeMediaSource(item);
  }, [item]);

  return (
    <MediaRenderer
      src={mediaItem}
      type={mediaItem.media_type}
      className={className}
      autoPlay={autoPlay}
      controls={controls}
      muted={muted}
      loop={loop}
      poster={poster || mediaItem.poster}
      showWatermark={showWatermark}
      onClick={onClick}
      onLoad={onLoad}
      onError={onError}
      onEnded={onEnded}
      onTimeUpdate={onTimeUpdate}
      allowRetry={true}
      maxRetries={maxRetries}
      ref={ref}
    />
  );
});

UniversalMedia.displayName = 'UniversalMedia';

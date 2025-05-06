
import { forwardRef, Ref, useMemo } from 'react';
import { MediaRenderer } from '@/components/media/MediaRenderer';
import { MediaSource, MediaOptions, MediaType } from '@/utils/media/types';

interface UniversalMediaProps extends MediaOptions {
  item: MediaSource | string;
  showWatermark?: boolean;
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
  onTimeUpdate
}: UniversalMediaProps, ref: Ref<HTMLVideoElement | HTMLImageElement>) => {
  // Create stable media item reference
  const mediaItem = useMemo(() => {
    if (typeof item === 'string') {
      return item;
    }
    return {
      ...item,
      media_type: item.media_type || 
                 (item.video_url ? MediaType.VIDEO : 
                 item.media_url ? MediaType.IMAGE : MediaType.UNKNOWN)
    };
  }, [item]);

  return (
    <MediaRenderer
      src={mediaItem}
      className={className}
      autoPlay={autoPlay}
      controls={controls}
      muted={muted}
      loop={loop}
      poster={poster}
      showWatermark={showWatermark}
      onClick={onClick}
      onLoad={onLoad}
      onError={onError}
      onEnded={onEnded}
      onTimeUpdate={onTimeUpdate}
      ref={ref}
      allowRetry={true}
      maxRetries={2}
    />
  );
});

UniversalMedia.displayName = 'UniversalMedia';

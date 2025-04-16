
import { forwardRef, Ref } from 'react';
import { Media } from '@/components/media/Media';
import { MediaSource, MediaOptions } from '@/utils/media/types';

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
  return (
    <Media
      source={item}
      className={className}
      autoPlay={autoPlay}
      controls={controls}
      muted={muted}
      loop={loop}
      poster={poster}
      onClick={onClick}
      onLoad={onLoad}
      onError={onError}
      onEnded={onEnded}
      onTimeUpdate={onTimeUpdate ? (e) => {
        const videoElement = e.target as HTMLVideoElement;
        onTimeUpdate(videoElement.currentTime);
      } : undefined}
    />
  );
});

UniversalMedia.displayName = "UniversalMedia";

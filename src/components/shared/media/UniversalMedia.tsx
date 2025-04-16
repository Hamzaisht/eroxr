
import { forwardRef, Ref } from 'react';
import { Media } from '@/components/shared/media/Media';
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
  // Handle timeUpdate events
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    if (onTimeUpdate) {
      const videoElement = e.currentTarget;
      onTimeUpdate(videoElement.currentTime);
    }
  };
  
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
      onTimeUpdate={handleTimeUpdate}
    />
  );
});

UniversalMedia.displayName = "UniversalMedia";

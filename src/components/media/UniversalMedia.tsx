
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
  // Create a handler that converts from the Media component's event format to the simpler format expected by onTimeUpdate
  const handleTimeUpdate = onTimeUpdate 
    ? (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
        const videoElement = e.target as HTMLVideoElement;
        onTimeUpdate(videoElement.currentTime);
      } 
    : undefined;
  
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
      ref={ref}
    />
  );
});

UniversalMedia.displayName = "UniversalMedia";

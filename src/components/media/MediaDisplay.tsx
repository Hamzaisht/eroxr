
import { forwardRef } from 'react';
import { MediaType } from '@/utils/media/types';

interface MediaDisplayProps {
  mediaUrl: string;
  mediaType: MediaType;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  onClick?: () => void;
  onError?: () => void;
  onLoad?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (time: number) => void;
}

export const MediaDisplay = forwardRef<HTMLVideoElement | HTMLImageElement, MediaDisplayProps>(({
  mediaUrl,
  mediaType,
  className = '',
  autoPlay = false,
  controls = true,
  muted = true,
  loop = false,
  poster,
  onClick,
  onError,
  onLoad,
  onEnded,
  onTimeUpdate
}, ref) => {
  if (mediaType === MediaType.VIDEO) {
    return (
      <video
        src={mediaUrl}
        className={className}
        autoPlay={autoPlay}
        controls={controls}
        muted={muted}
        loop={loop}
        poster={poster}
        onClick={onClick}
        onError={onError}
        onLoadedData={onLoad}
        onEnded={onEnded}
        onTimeUpdate={e => {
          if (onTimeUpdate) {
            onTimeUpdate((e.target as HTMLVideoElement).currentTime);
          }
        }}
        playsInline
        ref={ref as React.Ref<HTMLVideoElement>}
      />
    );
  }

  if (mediaType === MediaType.AUDIO) {
    return (
      <audio
        src={mediaUrl}
        className={className}
        autoPlay={autoPlay}
        controls={controls}
        muted={muted}
        loop={loop}
        onError={onError}
        onLoadedData={onLoad}
        onEnded={onEnded}
        onTimeUpdate={e => {
          if (onTimeUpdate) {
            onTimeUpdate((e.target as HTMLAudioElement).currentTime);
          }
        }}
        ref={ref as React.Ref<HTMLAudioElement>}
      />
    );
  }

  // Default to image for anything else
  return (
    <img
      src={mediaUrl}
      className={className}
      onClick={onClick}
      onError={onError}
      onLoad={onLoad}
      alt="Media content"
      ref={ref as React.Ref<HTMLImageElement>}
    />
  );
});

MediaDisplay.displayName = 'MediaDisplay';


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
  onLoad?: () => void;
  onError?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (time: number) => void;
}

export const MediaDisplay = forwardRef<HTMLVideoElement | HTMLImageElement, MediaDisplayProps>(
  ({
    mediaUrl,
    mediaType,
    className = '',
    autoPlay = false,
    controls = true,
    muted = true,
    loop = false,
    poster,
    onClick,
    onLoad,
    onError,
    onEnded,
    onTimeUpdate
  }, ref) => {
    // Custom handler for video time updates
    const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
      if (onTimeUpdate) {
        onTimeUpdate(e.currentTarget.currentTime);
      }
    };

    switch (mediaType) {
      case MediaType.VIDEO:
        return (
          <video
            ref={ref as React.RefObject<HTMLVideoElement>}
            src={mediaUrl}
            className={className}
            poster={poster}
            autoPlay={autoPlay}
            controls={controls}
            muted={muted}
            loop={loop}
            onClick={onClick}
            onLoadedData={onLoad}
            onError={onError}
            onEnded={onEnded}
            onTimeUpdate={handleTimeUpdate}
            playsInline
          />
        );

      case MediaType.IMAGE:
      case MediaType.GIF:
        return (
          <img
            ref={ref as React.RefObject<HTMLImageElement>}
            src={mediaUrl}
            className={className}
            onClick={onClick}
            onLoad={onLoad}
            onError={onError}
            alt="Media content"
          />
        );

      case MediaType.AUDIO:
        return (
          <audio
            src={mediaUrl}
            className={className}
            controls={controls}
            autoPlay={autoPlay}
            muted={muted}
            loop={loop}
            onLoadedData={onLoad}
            onError={onError}
            onEnded={onEnded}
          />
        );

      default:
        return (
          <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
            <p>Unsupported media type</p>
          </div>
        );
    }
  }
);

MediaDisplay.displayName = 'MediaDisplay';

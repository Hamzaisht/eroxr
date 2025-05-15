
import { forwardRef, useState } from 'react';
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
  onTimeUpdate?: () => void;
}

export const MediaDisplay = forwardRef<HTMLVideoElement | HTMLImageElement, MediaDisplayProps>(({
  mediaUrl,
  mediaType,
  className,
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
  const [isLoaded, setIsLoaded] = useState(false);
  
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };
  
  // Render content based on media type
  switch (mediaType) {
    case MediaType.VIDEO:
      return (
        <video
          ref={ref as React.RefObject<HTMLVideoElement>}
          src={mediaUrl}
          className={className}
          autoPlay={autoPlay}
          controls={controls}
          muted={muted}
          loop={loop}
          poster={poster}
          onClick={onClick}
          onLoadedData={handleLoad}
          onError={onError}
          onEnded={onEnded}
          onTimeUpdate={onTimeUpdate}
          playsInline
        />
      );
    
    case MediaType.IMAGE:
      return (
        <img
          ref={ref as React.RefObject<HTMLImageElement>}
          src={mediaUrl}
          className={className}
          onClick={onClick}
          onLoad={handleLoad}
          onError={onError}
        />
      );
      
    case MediaType.AUDIO:
      return (
        <audio
          src={mediaUrl}
          className={className}
          autoPlay={autoPlay}
          controls={controls}
          muted={muted}
          loop={loop}
          onClick={onClick}
          onLoadedData={handleLoad}
          onError={onError}
          onEnded={onEnded}
        />
      );
    
    default:
      // For unknown types, try to render as image first
      return (
        <img
          ref={ref as React.RefObject<HTMLImageElement>}
          src={mediaUrl}
          className={className}
          onClick={onClick}
          onLoad={handleLoad}
          onError={onError}
        />
      );
  }
});

MediaDisplay.displayName = 'MediaDisplay';

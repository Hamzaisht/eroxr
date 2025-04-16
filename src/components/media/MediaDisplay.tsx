
import { forwardRef } from 'react';
import { MediaType, MediaOptions } from '@/utils/media/types';

interface MediaDisplayProps extends MediaOptions {
  /**
   * The media URL to display
   */
  mediaUrl: string;
  
  /**
   * The type of media being displayed
   */
  mediaType: MediaType;
}

/**
 * Render the appropriate media element based on media type
 */
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
    if (mediaType === MediaType.VIDEO) {
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
          onLoadedData={onLoad}
          onError={onError}
          onEnded={onEnded}
          onTimeUpdate={onTimeUpdate ? (e) => onTimeUpdate((e.target as HTMLVideoElement).currentTime) : undefined}
          playsInline
        />
      );
    }

    if (mediaType === MediaType.IMAGE) {
      return (
        <img
          ref={ref as React.RefObject<HTMLImageElement>}
          src={mediaUrl}
          className={className}
          onClick={onClick}
          onLoad={onLoad}
          onError={onError}
          alt=""
        />
      );
    }

    // For other media types, return a placeholder or error
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}>
        <p className="text-gray-500">Unsupported media</p>
      </div>
    );
  }
);

MediaDisplay.displayName = 'MediaDisplay';

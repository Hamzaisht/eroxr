
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
  mediaType: MediaType | string;
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
    // Create a handler that converts from event to number
    const handleTimeUpdate = onTimeUpdate 
      ? (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
          const videoElement = e.currentTarget;
          onTimeUpdate(videoElement.currentTime);
        } 
      : undefined;
    
    // Create event handlers that adapt our React events to our component's API
    const handleError = onError 
      ? (e: React.SyntheticEvent<HTMLVideoElement | HTMLImageElement, Event>) => {
          onError();
        }
      : undefined;
        
    if (mediaType === MediaType.VIDEO || mediaType === 'video') {
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
          onError={handleError}
          onEnded={onEnded}
          onTimeUpdate={handleTimeUpdate}
          playsInline
        />
      );
    }

    if (mediaType === MediaType.IMAGE || mediaType === 'image') {
      return (
        <img
          ref={ref as React.RefObject<HTMLImageElement>}
          src={mediaUrl}
          className={className}
          onClick={onClick}
          onLoad={onLoad}
          onError={handleError}
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

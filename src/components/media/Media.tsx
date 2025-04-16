
import { forwardRef, useState, useRef, useEffect } from 'react';
import { MediaType, MediaSource, MediaOptions } from '@/utils/media/types';
import { determineMediaType, extractMediaUrl } from '@/utils/media/mediaUtils';
import { getPlayableMediaUrl } from '@/utils/media/getPlayableMediaUrl';

interface MediaComponentProps extends MediaOptions {
  source: MediaSource | string;
}

export const Media = forwardRef<HTMLVideoElement | HTMLImageElement, MediaComponentProps>(({
  source,
  className = "",
  autoPlay = false,
  controls = false,
  muted = true,
  loop = false,
  poster,
  onClick,
  onLoad,
  onError,
  onEnded,
  onTimeUpdate
}, ref) => {
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.UNKNOWN);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    if (source) {
      try {
        // Determine the media type
        const type = determineMediaType(source);
        setMediaType(type);
        
        // Get the media URL
        const url = getPlayableMediaUrl(source);
        setMediaUrl(url);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error processing media source:', error);
        setHasError(true);
        setIsLoading(false);
        if (onError) onError();
      }
    }
  }, [source, onError]);

  const handleLoad = () => {
    if (onLoad) onLoad();
  };

  const handleError = () => {
    console.error('Error loading media:', mediaUrl);
    setHasError(true);
    if (onError) onError();
  };

  const handleTimeUpdate = () => {
    if (onTimeUpdate && videoRef.current) {
      onTimeUpdate(videoRef.current.currentTime);
    }
  };

  if (isLoading) {
    return <div className={`${className} bg-black/10 animate-pulse`} />;
  }

  if (hasError) {
    return (
      <div className={`${className} bg-black/10 flex items-center justify-center`}>
        <span className="text-xs text-muted-foreground">Media error</span>
      </div>
    );
  }

  if (mediaType === MediaType.IMAGE) {
    return (
      <img
        ref={imgRef as React.RefObject<HTMLImageElement>}
        src={mediaUrl}
        alt="Media content"
        className={className}
        onClick={onClick}
        onLoad={handleLoad}
        onError={handleError}
      />
    );
  }

  if (mediaType === MediaType.VIDEO) {
    return (
      <video
        ref={videoRef as React.RefObject<HTMLVideoElement>}
        src={mediaUrl}
        className={className}
        autoPlay={autoPlay}
        controls={controls}
        muted={muted}
        loop={loop}
        poster={poster}
        onClick={onClick}
        onLoadedData={handleLoad}
        onError={handleError}
        onEnded={onEnded}
        onTimeUpdate={handleTimeUpdate}
        playsInline
      />
    );
  }

  // Fallback for unknown type
  return (
    <div className={`${className} bg-black/10 flex items-center justify-center`}>
      <span className="text-xs text-muted-foreground">Unsupported media</span>
    </div>
  );
});

Media.displayName = 'Media';

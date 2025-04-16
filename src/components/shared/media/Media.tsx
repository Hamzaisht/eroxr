
import { forwardRef, useState, useEffect } from 'react';
import { MediaType, MediaSource } from '@/utils/media/types';
import { determineMediaType, extractMediaUrl } from '@/utils/media/mediaUtils';
import { getPlayableMediaUrl } from '@/utils/media/urlUtils';
import { Loader2, AlertCircle } from 'lucide-react';

interface MediaProps {
  source: MediaSource | string;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  showWatermark?: boolean;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (event: React.SyntheticEvent<HTMLVideoElement>) => void;
}

export const Media = forwardRef<HTMLVideoElement | HTMLImageElement, MediaProps>(({
  source,
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
}, ref) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.UNKNOWN);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!source) {
      setError('No media source provided');
      setIsLoading(false);
      return;
    }

    try {
      const type = determineMediaType(source);
      setMediaType(type);

      const url = typeof source === 'string' 
        ? source 
        : extractMediaUrl(source);

      if (!url) {
        setError('Could not extract media URL');
        setIsLoading(false);
        return;
      }

      const playableUrl = getPlayableMediaUrl(url);
      setMediaUrl(playableUrl);
    } catch (err) {
      console.error('Error processing media:', err);
      setError('Error processing media');
    } finally {
      setIsLoading(false);
    }
  }, [source]);

  const handleLoad = () => {
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setError('Failed to load media');
    if (onError) onError();
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
      </div>
    );
  }

  if (error || !mediaUrl) {
    return (
      <div className={`flex flex-col items-center justify-center ${className} bg-luxury-darker/50`}>
        <AlertCircle className="h-8 w-8 text-luxury-neutral/50 mb-2" />
        <p className="text-sm text-luxury-neutral/70">Media unavailable</p>
      </div>
    );
  }

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
        onLoadedData={handleLoad}
        onError={handleError}
        onEnded={onEnded}
        onTimeUpdate={onTimeUpdate}
        playsInline
      />
    );
  }

  return (
    <img
      ref={ref as React.RefObject<HTMLImageElement>}
      src={mediaUrl}
      className={className}
      onClick={onClick}
      onLoad={handleLoad}
      onError={handleError}
      alt="Media content"
    />
  );
});

Media.displayName = 'Media';

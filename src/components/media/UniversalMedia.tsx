
import { forwardRef, useState, useEffect, useMemo, useCallback, Ref, memo } from 'react';
import { MediaType, MediaSource, MediaOptions } from '@/utils/media/types';
import { extractMediaUrl } from '@/utils/media/urlUtils';
import { determineMediaType } from '@/utils/media/mediaUtils';

interface UniversalMediaProps extends MediaOptions {
  item: MediaSource | string | null;
}

export const UniversalMedia = memo(forwardRef(({
  item,
  className = "",
  autoPlay = false,
  controls = true,
  muted = true,
  loop = false,
  poster,
  showWatermark = false,
  objectFit = 'cover',
  alt = "Media content",
  onClick,
  onLoad,
  onError,
  onEnded,
  onTimeUpdate,
  maxRetries = 2
}: UniversalMediaProps, ref: Ref<HTMLVideoElement | HTMLImageElement>) => {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.UNKNOWN);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Process the media source
  useEffect(() => {
    if (!item) {
      setError('No media source provided');
      setIsLoading(false);
      return;
    }

    try {
      // Convert the item to a standardized MediaSource object
      const source: MediaSource = typeof item === 'string' 
        ? { url: item } 
        : { 
            url: item.url || item.video_url || item.media_url || '',
            video_url: item.video_url,
            media_url: item.media_url,
            thumbnail_url: item.thumbnail_url,
            media_type: item.media_type,
            creator_id: item.creator_id
          };

      // Extract URL
      const extractedUrl = extractMediaUrl(source);
      if (!extractedUrl) {
        setError('Could not extract media URL');
        setIsLoading(false);
        return;
      }

      // Set the URL and media type
      setMediaUrl(extractedUrl);
      setMediaType(determineMediaType(source));
      setIsLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error processing media:', err);
      setError('Failed to process media');
      setIsLoading(false);
    }
  }, [item]);

  // Memoized callbacks to prevent rerenders
  const handleLoad = useCallback(() => {
    if (onLoad) onLoad();
  }, [onLoad]);
  
  const handleError = useCallback(() => {
    if (onError) onError();
  }, [onError]);
  
  const handleEnded = useCallback(() => {
    if (onEnded) onEnded();
  }, [onEnded]);
  
  const handleTimeUpdate = useCallback((time: number) => {
    if (onTimeUpdate) onTimeUpdate(time);
  }, [onTimeUpdate]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-black/10 ${className}`}>
        <div className="animate-spin h-8 w-8 border-4 border-gray-400 border-t-white rounded-full"></div>
      </div>
    );
  }

  if (error || !mediaUrl) {
    return (
      <div className={`flex items-center justify-center bg-black/10 ${className}`}>
        <p className="text-sm text-gray-400">{error || 'Media unavailable'}</p>
      </div>
    );
  }

  // For video content
  if (mediaType === MediaType.VIDEO) {
    return (
      <div className="relative w-full h-full">
        <video
          ref={ref as React.RefObject<HTMLVideoElement>}
          src={mediaUrl}
          className={className}
          style={{ objectFit }}
          autoPlay={autoPlay}
          controls={controls}
          muted={muted}
          loop={loop}
          poster={poster}
          onClick={onClick}
          onLoadedData={handleLoad}
          onError={handleError}
          onEnded={handleEnded}
          onTimeUpdate={e => handleTimeUpdate(e.currentTarget.currentTime)}
          playsInline
        />
        {showWatermark && (
          <div className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-1.5 py-0.5 rounded">
            eroxr
          </div>
        )}
      </div>
    );
  }

  // For image content
  if (mediaType === MediaType.IMAGE || mediaType === MediaType.GIF) {
    return (
      <div className="relative w-full h-full">
        <img
          ref={ref as React.RefObject<HTMLImageElement>}
          src={mediaUrl}
          alt={alt}
          className={className}
          style={{ objectFit }}
          onClick={onClick}
          onLoad={handleLoad}
          onError={handleError}
        />
        {showWatermark && (
          <div className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-1.5 py-0.5 rounded">
            eroxr
          </div>
        )}
      </div>
    );
  }

  // For audio content
  if (mediaType === MediaType.AUDIO) {
    return (
      <div className={`audio-player ${className}`}>
        <audio
          src={mediaUrl}
          controls={controls}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          onLoadedData={handleLoad}
          onError={handleError}
          onEnded={handleEnded}
          className="w-full"
        />
      </div>
    );
  }

  // For document or unknown content types
  return (
    <div className={`flex items-center justify-center bg-black/10 ${className}`}>
      <p className="text-sm text-gray-400">Unsupported media format</p>
    </div>
  );
}));

UniversalMedia.displayName = 'UniversalMedia';

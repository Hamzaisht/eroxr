import { useState, useEffect, forwardRef } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { MediaType } from '@/utils/media/types';
import { determineMediaType, extractMediaUrl } from '@/utils/media/mediaUtils';
import { getPlayableMediaUrl } from '@/utils/media/urlUtils';

interface MediaProps {
  source: any;
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
  onTimeUpdate?: (time: number) => void;
}

export const Media = forwardRef<HTMLVideoElement | HTMLImageElement, MediaProps>(
  (
    {
      source,
      className = '',
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
      onTimeUpdate,
    },
    ref
  ) => {
    const [url, setUrl] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<MediaType>(MediaType.UNKNOWN);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      if (!source) {
        setError('No media source provided');
        setIsLoading(false);
        return;
      }

      try {
        // Extract URL from source
        const extractedUrl = extractMediaUrl(source);
        if (!extractedUrl) {
          setError('Could not extract media URL');
          setIsLoading(false);
          return;
        }

        // Get playable URL
        const playableUrl = getPlayableMediaUrl(extractedUrl);
        setUrl(playableUrl);

        // Determine media type
        const typeString = determineMediaType(source);
        // Convert string type to MediaType enum
        setMediaType(typeString);
      } catch (err) {
        console.error('Error processing media:', err);
        setError('Failed to process media');
      } finally {
        setIsLoading(false);
      }
    }, [source]);

    // Custom handler for video time updates that converts event to time
    const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
      if (onTimeUpdate) {
        onTimeUpdate(e.currentTarget.currentTime);
      }
    };

    if (isLoading) {
      return (
        <div className={`flex items-center justify-center bg-black/10 ${className}`}>
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      );
    }

    if (error || !url) {
      return (
        <div className={`flex items-center justify-center bg-black/10 ${className}`}>
          <div className="text-center p-4">
            <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2" />
            <p className="text-sm text-gray-500">{error || 'Media unavailable'}</p>
          </div>
        </div>
      );
    }

    // For video content
    if (mediaType === MediaType.VIDEO) {
      return (
        <div className="relative w-full h-full">
          <video
            ref={ref as React.RefObject<HTMLVideoElement>}
            src={url}
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
            onTimeUpdate={handleTimeUpdate}
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
    if (mediaType === MediaType.IMAGE) {
      return (
        <div className="relative w-full h-full">
          <img
            ref={ref as React.RefObject<HTMLImageElement>}
            src={url}
            className={className}
            onClick={onClick}
            onLoad={onLoad}
            onError={onError}
            alt="Media content"
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
            src={url}
            controls={controls}
            autoPlay={autoPlay}
            muted={muted}
            loop={loop}
            onLoadedData={onLoad}
            onError={onError}
            onEnded={onEnded}
            className="w-full"
          />
        </div>
      );
    }

    // For document or unknown content types
    return (
      <div className={`flex items-center justify-center bg-black/10 ${className}`}>
        <p className="text-sm text-gray-500">Unsupported media format</p>
      </div>
    );
  }
);

Media.displayName = 'Media';

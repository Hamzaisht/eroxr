
import { useState, useEffect, forwardRef } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { MediaType } from '@/types/media';
import { MediaRenderer } from '@/components/media/MediaRenderer';
import { normalizeMediaSource } from '@/utils/media/mediaUtils';

type MediaProps = {
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
    const [mediaSource, setMediaSource] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      console.log('Media component - Processing source:', source);
      
      if (!source) {
        setError('No media source provided');
        return;
      }

      try {
        const normalized = normalizeMediaSource(source);
        console.log('Media component - Normalized source:', normalized);
        
        if (!normalized.url) {
          setError('Could not extract media URL');
          return;
        }
        
        setMediaSource(normalized);
        setError(null);
      } catch (err) {
        console.error('Media component - Error processing source:', err);
        setError('Failed to process media');
      }
    }, [source]);

    // Custom handler for video time updates
    const handleTimeUpdate = (currentTime: number, duration: number) => {
      if (onTimeUpdate) {
        onTimeUpdate(currentTime);
      }
    };

    if (error) {
      return (
        <div className={`flex items-center justify-center bg-black/10 ${className}`}>
          <div className="text-center p-4">
            <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2" />
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        </div>
      );
    }

    if (!mediaSource) {
      return (
        <div className={`flex items-center justify-center bg-black/10 ${className}`}>
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      );
    }

    return (
      <MediaRenderer
        ref={ref}
        src={mediaSource}
        className={className}
        autoPlay={autoPlay}
        controls={controls}
        muted={muted}
        loop={loop}
        poster={poster}
        showWatermark={showWatermark}
        onClick={onClick}
        onLoad={onLoad}
        onError={onError}
        onEnded={onEnded}
        onTimeUpdate={handleTimeUpdate}
        allowRetry={true}
        maxRetries={3}
      />
    );
  }
);

Media.displayName = 'Media';

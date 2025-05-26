
import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { MediaSource, MediaType } from '@/types/media';
import { isImageType, isVideoType, isAudioType } from '@/utils/media/mediaTypeUtils';
import { extractMediaUrl, determineMediaType } from '@/utils/media/mediaUtils';

interface MediaRendererProps {
  src: MediaSource | string;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  showWatermark?: boolean;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: (error?: any) => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  allowRetry?: boolean;
  maxRetries?: number;
}

export const MediaRenderer = forwardRef<HTMLVideoElement | HTMLImageElement, MediaRendererProps>(
  (
    {
      src,
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
      allowRetry = true,
      maxRetries = 3,
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    const [mediaUrl, setMediaUrl] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<MediaType>(MediaType.UNKNOWN);

    useEffect(() => {
      console.log('MediaRenderer - Processing source:', src);
      
      if (!src) {
        setError('No media source provided');
        setIsLoading(false);
        return;
      }

      try {
        // Extract URL from source
        const url = extractMediaUrl(src);
        console.log('MediaRenderer - Extracted URL:', url);
        
        if (!url) {
          setError('Could not extract media URL');
          setIsLoading(false);
          return;
        }

        // Determine media type
        const type = typeof src === 'object' && 'type' in src ? src.type : determineMediaType(url);
        console.log('MediaRenderer - Determined type:', type);
        
        setMediaUrl(url);
        setMediaType(type);
        setError(null);
        setIsLoading(true);
      } catch (err) {
        console.error('MediaRenderer - Error processing source:', err);
        setError('Failed to process media source');
        setIsLoading(false);
      }
    }, [src, retryCount]);

    const handleLoad = () => {
      console.log('MediaRenderer - Media loaded successfully:', mediaUrl);
      setIsLoading(false);
      setError(null);
      onLoad?.();
    };

    const handleError = (e?: any) => {
      console.error('MediaRenderer - Media load error:', e, 'URL:', mediaUrl);
      setIsLoading(false);
      setError('Failed to load media');
      onError?.(e);
    };

    const handleRetry = () => {
      if (retryCount < maxRetries) {
        console.log(`MediaRenderer - Retrying (${retryCount + 1}/${maxRetries}):`, mediaUrl);
        setRetryCount(prev => prev + 1);
        setError(null);
        setIsLoading(true);
      }
    };

    const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
      if (onTimeUpdate) {
        const video = e.currentTarget;
        onTimeUpdate(video.currentTime, video.duration);
      }
    };

    // Loading state
    if (isLoading && !error) {
      return (
        <div className={`flex items-center justify-center bg-black/10 ${className}`}>
          <div className="text-center p-4">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Loading media...</p>
          </div>
        </div>
      );
    }

    // Error state with retry option
    if (error || !mediaUrl) {
      return (
        <div className={`flex items-center justify-center bg-black/10 ${className}`}>
          <div className="text-center p-4">
            <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2" />
            <p className="text-sm text-gray-500 mb-3">{error || 'Media unavailable'}</p>
            {allowRetry && retryCount < maxRetries && (
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                Retry ({retryCount + 1}/{maxRetries})
              </button>
            )}
          </div>
        </div>
      );
    }

    // Render based on media type
    if (isVideoType(mediaType)) {
      return (
        <div className="relative w-full h-full">
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
            onTimeUpdate={handleTimeUpdate}
            playsInline
            preload="metadata"
          />
          {showWatermark && (
            <div className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-1.5 py-0.5 rounded">
              eroxr
            </div>
          )}
        </div>
      );
    }

    if (isImageType(mediaType)) {
      return (
        <div className="relative w-full h-full">
          <img
            ref={ref as React.RefObject<HTMLImageElement>}
            src={mediaUrl}
            className={className}
            onClick={onClick}
            onLoad={handleLoad}
            onError={handleError}
            alt="Media content"
            loading="lazy"
          />
          {showWatermark && (
            <div className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-1.5 py-0.5 rounded">
              eroxr
            </div>
          )}
        </div>
      );
    }

    if (isAudioType(mediaType)) {
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
            onEnded={onEnded}
            className="w-full"
            preload="metadata"
          />
        </div>
      );
    }

    // Unsupported media type
    return (
      <div className={`flex items-center justify-center bg-black/10 ${className}`}>
        <div className="text-center p-4">
          <AlertCircle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Unsupported media format</p>
          <p className="text-xs text-gray-400 mt-1">Type: {mediaType}</p>
        </div>
      </div>
    );
  }
);

MediaRenderer.displayName = 'MediaRenderer';

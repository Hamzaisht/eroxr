
import React, { useState, useCallback, useEffect, forwardRef } from 'react';
import { extractMediaUrl, getPlayableMediaUrl } from '@/utils/media/urlUtils';
import { MediaType } from '@/utils/media/types';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface MediaRendererProps {
  src: any; // Media source (object or string)
  type?: MediaType; // Explicit media type override
  className?: string;
  fallbackSrc?: string; // Optional fallback source
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
  style?: React.CSSProperties;
  allowRetry?: boolean;
  maxRetries?: number;
}

export const MediaRenderer = forwardRef<HTMLVideoElement | HTMLImageElement, MediaRendererProps>(
  ({
    src,
    type,
    className = '',
    fallbackSrc,
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
    style,
    allowRetry = false,
    maxRetries = 2
  }, ref) => {
    // State for handling media loading and errors
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    
    // Extract URL from media source
    const rawUrl = extractMediaUrl(src);
    const resolvedUrl = rawUrl ? getPlayableMediaUrl(rawUrl) : null;

    // Determine media type from source if not explicitly provided
    const mediaType = type || determineMediaType(src);
    
    // Log details to help with debugging
    useEffect(() => {
      if (!resolvedUrl) {
        console.warn("MediaRenderer: Missing media URL", { src, mediaType });
      }
    }, [resolvedUrl, src, mediaType]);
    
    // Handle media loading success
    const handleLoad = useCallback(() => {
      setIsLoading(false);
      setHasError(false);
      if (onLoad) onLoad();
    }, [onLoad]);
    
    // Handle media loading error
    const handleError = useCallback(() => {
      console.error("MediaRenderer error:", {
        url: resolvedUrl,
        mediaType,
        retryCount
      });
      
      setIsLoading(false);
      setHasError(true);
      
      if (retryCount < maxRetries && resolvedUrl) {
        console.log(`Retrying media load (${retryCount + 1}/${maxRetries})`, resolvedUrl);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          setIsLoading(true);
          setHasError(false);
        }, 1000);
      } else {
        if (onError) onError();
      }
    }, [resolvedUrl, retryCount, maxRetries, mediaType, onError]);
    
    // Handle media playback ended
    const handleEnded = useCallback(() => {
      if (onEnded) onEnded();
    }, [onEnded]);
    
    // Handle video time updates
    const handleTimeUpdate = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
      if (onTimeUpdate) {
        onTimeUpdate(e.currentTarget.currentTime);
      }
    }, [onTimeUpdate]);
    
    // Handle retry button click
    const handleRetry = () => {
      setRetryCount(0);
      setIsLoading(true);
      setHasError(false);
    };
    
    // Determine which media type to render based on the source
    function determineMediaType(source: any): MediaType {
      if (!source) return MediaType.UNKNOWN;
      
      if (typeof source === 'string') {
        // Determine by file extension for string URLs
        if (/\.(mp4|webm|ogv)($|\?)/i.test(source)) return MediaType.VIDEO;
        if (/\.(jpg|jpeg|png|gif|webp)($|\?)/i.test(source)) return MediaType.IMAGE;
        return MediaType.UNKNOWN;
      }
      
      // For object sources
      if (source.media_type) return source.media_type;
      if (source.video_url || source.video_urls) return MediaType.VIDEO;
      if (source.media_url || source.media_urls) return MediaType.IMAGE;
      
      return MediaType.UNKNOWN;
    }
    
    // If no URL is available, show placeholder
    if (!resolvedUrl) {
      return (
        <div className={`${className} bg-black/20 flex items-center justify-center`}>
          <AlertCircle className="w-6 h-6 text-gray-400" />
        </div>
      );
    }
    
    // Show loading indicator
    if (isLoading && !hasError) {
      return (
        <div className={`${className} bg-black/20 flex items-center justify-center`}>
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      );
    }
    
    // Show error state with retry option
    if (hasError) {
      return (
        <div className={`${className} bg-black/20 flex flex-col items-center justify-center`}>
          <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
          <p className="text-sm text-gray-400 mb-4">Failed to load media</p>
          {allowRetry && (
            <button 
              className="flex items-center gap-2 px-3 py-1.5 bg-primary/80 hover:bg-primary text-white rounded-md"
              onClick={handleRetry}
            >
              <RefreshCw className="h-4 w-4" /> 
              Retry
            </button>
          )}
        </div>
      );
    }
    
    // Render video
    if (mediaType === MediaType.VIDEO) {
      return (
        <div className="relative w-full h-full">
          <video
            ref={ref as React.RefObject<HTMLVideoElement>}
            src={resolvedUrl}
            className={className}
            poster={poster}
            autoPlay={autoPlay}
            controls={controls}
            muted={muted}
            loop={loop}
            playsInline
            onClick={onClick}
            onLoadedData={handleLoad}
            onError={handleError}
            onEnded={handleEnded}
            onTimeUpdate={handleTimeUpdate}
            style={style}
          />
          {showWatermark && (
            <div className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-1.5 py-0.5 rounded">
              eroxr
            </div>
          )}
        </div>
      );
    }
    
    // Render image
    if (mediaType === MediaType.IMAGE) {
      return (
        <div className="relative w-full h-full">
          <img
            ref={ref as React.RefObject<HTMLImageElement>}
            src={resolvedUrl}
            className={className}
            alt="Media content"
            onClick={onClick}
            onLoad={handleLoad}
            onError={handleError}
            style={style}
          />
          {showWatermark && (
            <div className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-1.5 py-0.5 rounded">
              eroxr
            </div>
          )}
        </div>
      );
    }
    
    // Fallback for unsupported media types
    return (
      <div className={`${className} bg-black/20 flex items-center justify-center`}>
        <p className="text-sm text-gray-400">Unsupported media format</p>
      </div>
    );
  }
);

MediaRenderer.displayName = 'MediaRenderer';

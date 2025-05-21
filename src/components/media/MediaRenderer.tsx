
import React, { useState, useEffect, forwardRef } from 'react';
import { MediaSource, MediaType } from '@/utils/media/types';
import { isImageType, isVideoType, isAudioType } from '@/utils/media/mediaTypeUtils';
import { extractMediaUrl } from '@/utils/media/mediaUtils';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface MediaRendererProps {
  src: MediaSource;
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
  ref?: React.Ref<HTMLVideoElement | HTMLImageElement>;
  allowRetry?: boolean;
  maxRetries?: number;
}

export const MediaRenderer = forwardRef<
  HTMLVideoElement | HTMLImageElement,
  MediaRendererProps
>(({
  src,
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
  onTimeUpdate,
  allowRetry = true,
  maxRetries = 2
}, ref) => {
  const [hasError, setHasError] = useState(false);
  const [retries, setRetries] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Extract the URL from the source
  const url = extractMediaUrl(src);
  const mediaType = src.type || MediaType.UNKNOWN;
  
  // Reset error state on src change
  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
    setRetries(0);
  }, [url]);
  
  // Handle load event
  const handleLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };
  
  // Handle error event
  const handleError = (error: any) => {
    console.error(`Media loading error for ${url}:`, error);
    setHasError(true);
    setIsLoading(false);
    
    if (retries < maxRetries && allowRetry) {
      const nextRetryCount = retries + 1;
      setRetries(nextRetryCount);
      console.log(`Retry ${nextRetryCount}/${maxRetries} for ${url}`);
      
      // Attempt to reload after a delay
      setTimeout(() => {
        setHasError(false);
        setIsLoading(true);
      }, 1000);
    }
    
    if (onError) onError(error);
  };
  
  // Handle time update for video
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (onTimeUpdate) {
      const video = e.currentTarget;
      onTimeUpdate(video.currentTime, video.duration);
    }
  };

  // Retry media loading
  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    setRetries(prev => prev + 1);
  };
  
  // Error display component
  const ErrorDisplay = () => (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 bg-black/10 text-center">
      <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
      <p className="text-sm text-gray-200 mb-3">Failed to load media</p>
      {allowRetry && retries < maxRetries && (
        <button 
          onClick={handleRetry}
          className="flex items-center gap-1 px-3 py-1.5 bg-primary/90 hover:bg-primary text-white rounded-md text-sm"
        >
          <RefreshCw className="h-3 w-3" /> 
          Retry
        </button>
      )}
    </div>
  );
  
  // Loading display
  const LoadingDisplay = () => (
    <div className="flex items-center justify-center h-full w-full bg-black/10">
      <div className="w-6 h-6 border-2 border-t-primary rounded-full animate-spin" />
    </div>
  );

  // Render based on media type
  if (isImageType(mediaType)) {
    return (
      <div className="relative w-full h-full">
        {isLoading && <LoadingDisplay />}
        
        {hasError ? (
          <ErrorDisplay />
        ) : (
          <img
            src={url}
            className={className}
            onClick={onClick}
            onLoad={handleLoad}
            onError={handleError}
            ref={ref as React.Ref<HTMLImageElement>}
            alt=""
          />
        )}
      </div>
    );
  } else if (isVideoType(mediaType)) {
    return (
      <div className="relative w-full h-full">
        {isLoading && <LoadingDisplay />}
        
        {hasError ? (
          <ErrorDisplay />
        ) : (
          <video
            src={url}
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
            ref={ref as React.Ref<HTMLVideoElement>}
            playsInline
          />
        )}
      </div>
    );
  } else if (isAudioType(mediaType)) {
    return (
      <div className="relative w-full">
        {isLoading && <LoadingDisplay />}
        
        {hasError ? (
          <ErrorDisplay />
        ) : (
          <audio
            src={url}
            className={className}
            autoPlay={autoPlay}
            controls={controls}
            muted={muted}
            loop={loop}
            onLoadedData={handleLoad}
            onError={handleError}
            onEnded={onEnded}
          />
        )}
      </div>
    );
  }
  
  // Unknown media type
  return (
    <div className="flex items-center justify-center h-full w-full bg-black/10 text-sm text-gray-400">
      Unsupported media type
    </div>
  );
});

MediaRenderer.displayName = 'MediaRenderer';

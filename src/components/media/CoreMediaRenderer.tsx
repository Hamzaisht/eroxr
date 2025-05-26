
import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { MediaType } from '@/types/media';
import { processMediaSource, cleanMediaUrl, MediaItem, isValidMediaSource } from '@/utils/media/coreMediaUtils';

interface CoreMediaRendererProps {
  source: any;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: (error?: any) => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  allowRetry?: boolean;
  maxRetries?: number;
  fallbackMessage?: string;
}

export const CoreMediaRenderer = ({
  source,
  className = "",
  controls = true,
  autoPlay = false,
  muted = true,
  loop = false,
  poster,
  onClick,
  onLoad,
  onError,
  onEnded,
  onTimeUpdate,
  allowRetry = true,
  maxRetries = 3,
  fallbackMessage = "Media not available"
}: CoreMediaRendererProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [mediaItem, setMediaItem] = useState<MediaItem | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    console.log('CoreMediaRenderer - Processing source:', source);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const processed = processMediaSource(source);
    console.log('CoreMediaRenderer - Processed media:', processed);
    
    if (!processed || !isValidMediaSource(processed)) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    // Clean the URL
    const cleanUrl = cleanMediaUrl(processed.url);
    const finalMediaItem = { ...processed, url: cleanUrl };
    
    setMediaItem(finalMediaItem);
    setIsLoading(true);
    setHasError(false);

    // Set timeout to prevent infinite loading
    timeoutRef.current = setTimeout(() => {
      console.warn('CoreMediaRenderer - Load timeout for:', cleanUrl);
      setIsLoading(false);
      setHasError(true);
    }, 10000); // 10 second timeout

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [source, retryCount]);

  const handleLoad = () => {
    console.log('CoreMediaRenderer - Media loaded successfully');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleError = (e?: any) => {
    console.error('CoreMediaRenderer - Media failed to load:', mediaItem?.url, e);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsLoading(false);
    setHasError(true);
    onError?.(e);
  };

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      console.log(`CoreMediaRenderer - Retrying (${retryCount + 1}/${maxRetries}):`, mediaItem?.url);
      setRetryCount(prev => prev + 1);
      setHasError(false);
      setIsLoading(true);
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (onTimeUpdate) {
      const video = e.currentTarget;
      onTimeUpdate(video.currentTime, video.duration);
    }
  };

  // Show error state
  if (hasError || !mediaItem) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg p-4 ${className}`}>
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 text-sm mb-2">{fallbackMessage}</p>
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

  // Show loading state
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg p-4 ${className}`}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin mx-auto mb-2" />
          <p className="text-gray-600 text-sm">Loading media...</p>
        </div>
      </div>
    );
  }

  // Render based on media type
  if (mediaItem.type === MediaType.VIDEO) {
    return (
      <video
        src={mediaItem.url}
        className={className}
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        poster={poster || mediaItem.poster}
        onClick={onClick}
        onLoadedData={handleLoad}
        onError={handleError}
        onEnded={onEnded}
        onTimeUpdate={handleTimeUpdate}
        playsInline
        preload="metadata"
      />
    );
  }

  if (mediaItem.type === MediaType.AUDIO) {
    return (
      <audio
        src={mediaItem.url}
        className={className}
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        onLoadedData={handleLoad}
        onError={handleError}
        onEnded={onEnded}
        preload="metadata"
      />
    );
  }

  // Default to image (includes GIF)
  return (
    <img
      src={mediaItem.url}
      className={className}
      onClick={onClick}
      onLoad={handleLoad}
      onError={handleError}
      alt="Media content"
      loading="lazy"
    />
  );
};

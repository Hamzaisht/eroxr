
import React, { useState, useEffect } from 'react';
import { MediaLoadingState } from './states/MediaLoadingState';
import { MediaErrorState } from './states/MediaErrorState';
import { isValidMediaUrl } from '@/utils/media/mediaOrchestrator';

interface SimpleMediaRendererProps {
  url: string;
  type: 'image' | 'video';
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: (error?: any) => void;
  compact?: boolean;
}

export const SimpleMediaRenderer = ({
  url,
  type,
  className = "",
  autoPlay = false,
  controls = true,
  muted = true,
  loop = false,
  poster,
  onClick,
  onLoad,
  onError,
  compact = false
}: SimpleMediaRendererProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  // Reset state when URL changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setRetryCount(0);
  }, [url]);

  // Validate URL
  if (!url || !isValidMediaUrl(url)) {
    return (
      <MediaErrorState 
        className={className}
        message="Invalid media URL"
        compact={compact}
      />
    );
  }

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    if (onLoad) onLoad();
  };

  const handleError = (error: any) => {
    console.log(`Media error for ${url}:`, error);
    setIsLoading(false);
    setHasError(true);
    if (onError) onError(error);
  };

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      setHasError(false);
      setIsLoading(true);
    }
  };

  if (hasError) {
    return (
      <MediaErrorState 
        className={className}
        message="Failed to load media"
        onRetry={retryCount < maxRetries ? handleRetry : undefined}
        retryCount={retryCount}
        maxRetries={maxRetries}
        compact={compact}
      />
    );
  }

  if (type === 'image') {
    return (
      <div className="relative w-full h-full">
        {isLoading && <MediaLoadingState />}
        <img
          key={`${url}-${retryCount}`}
          src={url}
          className={className}
          onClick={onClick}
          onLoad={handleLoad}
          onError={handleError}
          alt=""
          style={{ display: isLoading ? 'none' : 'block' }}
        />
      </div>
    );
  }

  if (type === 'video') {
    return (
      <div className="relative w-full h-full">
        {isLoading && <MediaLoadingState />}
        <video
          key={`${url}-${retryCount}`}
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
          playsInline
          style={{ display: isLoading ? 'none' : 'block' }}
        />
      </div>
    );
  }

  return (
    <MediaErrorState 
      className={className}
      message="Unsupported media type"
      compact={compact}
    />
  );
};

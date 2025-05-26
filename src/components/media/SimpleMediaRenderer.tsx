
import React, { useState, useEffect, useRef } from 'react';
import { MediaLoadingState } from './states/MediaLoadingState';
import { MediaErrorState } from './states/MediaErrorState';
import { isValidMediaUrl, processMediaUrl } from '@/utils/media/mediaOrchestrator';

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
  const [processedUrl, setProcessedUrl] = useState<string>('');
  const loadTimeoutRef = useRef<NodeJS.Timeout>();

  // Process URL and validate
  useEffect(() => {
    if (!url || !isValidMediaUrl(url)) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    const processed = processMediaUrl(url);
    setProcessedUrl(processed);
    setIsLoading(true);
    setHasError(false);

    // Set a timeout to prevent infinite loading
    loadTimeoutRef.current = setTimeout(() => {
      console.warn('Media load timeout for:', processed);
      setIsLoading(false);
      setHasError(true);
      if (onError) onError(new Error('Load timeout'));
    }, 10000); // 10 second timeout

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, [url, onError]);

  const handleLoad = () => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
    setIsLoading(false);
    setHasError(false);
    if (onLoad) onLoad();
  };

  const handleError = (error: any) => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
    console.warn(`Media error for ${type}:`, processedUrl, error);
    setIsLoading(false);
    setHasError(true);
    if (onError) onError(error);
  };

  // Show error if URL is invalid
  if (!processedUrl || hasError) {
    return (
      <MediaErrorState 
        className={className}
        message="Media not available"
        compact={compact}
      />
    );
  }

  if (type === 'image') {
    return (
      <div className="relative w-full h-full">
        {isLoading && <MediaLoadingState />}
        <img
          src={processedUrl}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onClick={onClick}
          onLoad={handleLoad}
          onError={handleError}
          alt=""
          loading="lazy"
        />
      </div>
    );
  }

  if (type === 'video') {
    return (
      <div className="relative w-full h-full">
        {isLoading && <MediaLoadingState />}
        <video
          src={processedUrl}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          autoPlay={autoPlay}
          controls={controls}
          muted={muted}
          loop={loop}
          poster={poster}
          onClick={onClick}
          onLoadedData={handleLoad}
          onError={handleError}
          playsInline
          preload="metadata"
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


import React, { useState, useRef, useEffect } from 'react';
import { processMediaSource, cleanMediaUrl, MediaItem } from '@/utils/media/coreMediaUtils';
import { AlertCircle, Loader2 } from 'lucide-react';

interface ReliableMediaRendererProps {
  source: any;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  onClick?: () => void;
  fallbackMessage?: string;
}

export const ReliableMediaRenderer = ({
  source,
  className = "",
  controls = true,
  autoPlay = false,
  muted = true,
  onClick,
  fallbackMessage = "Media not available"
}: ReliableMediaRendererProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [mediaItem, setMediaItem] = useState<MediaItem | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    console.log('ReliableMediaRenderer - Processing source:', source);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const processed = processMediaSource(source);
    console.log('ReliableMediaRenderer - Processed media:', processed);
    
    if (!processed) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    // Clean the URL
    const cleanUrl = cleanMediaUrl(processed.url);
    setMediaItem({ ...processed, url: cleanUrl });
    setIsLoading(true);
    setHasError(false);

    // Set timeout to prevent infinite loading
    timeoutRef.current = setTimeout(() => {
      console.warn('ReliableMediaRenderer - Load timeout for:', cleanUrl);
      setIsLoading(false);
      setHasError(true);
    }, 5000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [source]);

  const handleLoad = () => {
    console.log('ReliableMediaRenderer - Media loaded successfully');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    console.error('ReliableMediaRenderer - Media failed to load:', mediaItem?.url);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsLoading(false);
    setHasError(true);
  };

  // Show error state
  if (hasError || !mediaItem) {
    return (
      <div className={`flex items-center justify-center bg-gray-800 rounded-lg p-4 ${className}`}>
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">{fallbackMessage}</p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-800 rounded-lg p-4 ${className}`}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-blue-400 animate-spin mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Loading media...</p>
        </div>
      </div>
    );
  }

  // Render based on media type
  if (mediaItem.type === 'video') {
    return (
      <video
        src={mediaItem.url}
        className={className}
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        poster={mediaItem.thumbnail}
        onClick={onClick}
        onLoadedData={handleLoad}
        onError={handleError}
        playsInline
        preload="metadata"
      />
    );
  }

  if (mediaItem.type === 'audio') {
    return (
      <audio
        src={mediaItem.url}
        className={className}
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        onLoadedData={handleLoad}
        onError={handleError}
        preload="metadata"
      />
    );
  }

  // Default to image
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

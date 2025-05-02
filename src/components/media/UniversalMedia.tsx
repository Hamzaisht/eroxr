
import { forwardRef, useState, useEffect, useMemo, useCallback, Ref, memo } from 'react';
import { MediaType, MediaSource } from '@/utils/media/types';
import { MediaRenderer } from './MediaRenderer';

interface UniversalMediaProps {
  item: MediaSource | string | null;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  showWatermark?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  alt?: string;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  maxRetries?: number;
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
  // Create a stable object for the item
  const stableItem = useMemo(() => {
    // If string, just use it directly
    if (typeof item === 'string') {
      return item;
    }
    
    // For object items, create a stable reference
    if (item) {
      return { ...item };
    }
    
    return null;
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

  // Determine object fit styling
  const styleProps = useMemo(() => ({
    style: { objectFit }
  }), [objectFit]);

  return (
    <MediaRenderer
      ref={ref}
      src={stableItem}
      className={className}
      autoPlay={autoPlay}
      controls={controls}
      muted={muted}
      loop={loop}
      poster={poster}
      showWatermark={showWatermark}
      onClick={onClick}
      onLoad={handleLoad}
      onError={handleError}
      onEnded={handleEnded}
      onTimeUpdate={handleTimeUpdate}
      maxRetries={maxRetries}
      {...styleProps}
    />
  );
}));

UniversalMedia.displayName = 'UniversalMedia';

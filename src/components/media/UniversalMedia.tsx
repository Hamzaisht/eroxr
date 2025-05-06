
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
  // Create a stable memoized object for the item to prevent re-renders
  const stableItem = useMemo(() => {
    if (typeof item === 'string') {
      return item;
    }
    
    if (item) {
      // Return a new object with only the necessary properties
      if (item.media_type === MediaType.VIDEO || 
          (item.video_url || (item.video_urls && item.video_urls.length > 0))) {
        return {
          video_url: item.video_url || (item.video_urls && item.video_urls[0]),
          media_type: MediaType.VIDEO,
          creator_id: item.creator_id,
          thumbnail_url: item.thumbnail_url || item.poster
        };
      } else {
        return {
          media_url: item.media_url || item.url || (item.media_urls && item.media_urls[0]),
          media_type: item.media_type || MediaType.IMAGE,
          creator_id: item.creator_id
        };
      }
    }
    
    return null;
  }, [item]);
  
  const mediaType = useMemo(() => {
    if (typeof stableItem === 'object' && stableItem !== null) {
      return stableItem.media_type || 
            (stableItem.video_url ? MediaType.VIDEO : 
            (stableItem.media_url ? MediaType.IMAGE : MediaType.UNKNOWN));
    }
    return undefined;
  }, [stableItem]);
  
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

  // Debug logging to help identify issues
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('UniversalMedia render with:', {
        itemType: typeof item,
        mediaType,
        hasVideoUrl: typeof item === 'object' && item !== null && !!item.video_url,
        hasMediaUrl: typeof item === 'object' && item !== null && !!item.media_url
      });
    }
  }, [item, mediaType]);

  return (
    <MediaRenderer
      ref={ref}
      src={stableItem}
      type={mediaType}
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
}), (prevProps, nextProps) => {
  // Custom equality check to prevent unnecessary re-renders
  if (typeof prevProps.item === 'string' && typeof nextProps.item === 'string') {
    return prevProps.item === nextProps.item && 
           prevProps.className === nextProps.className &&
           prevProps.autoPlay === nextProps.autoPlay;
  }
  
  if (!prevProps.item || !nextProps.item) {
    return prevProps.item === nextProps.item;
  }
  
  if (typeof prevProps.item === 'object' && typeof nextProps.item === 'object') {
    const prevVideo = prevProps.item.video_url || (prevProps.item.video_urls && prevProps.item.video_urls[0]);
    const nextVideo = nextProps.item.video_url || (nextProps.item.video_urls && nextProps.item.video_urls[0]);
    
    if (prevVideo || nextVideo) {
      return prevVideo === nextVideo && 
             prevProps.autoPlay === nextProps.autoPlay &&
             prevProps.className === nextProps.className;
    }
    
    const prevMedia = prevProps.item.media_url || prevProps.item.url || (prevProps.item.media_urls && prevProps.item.media_urls[0]);
    const nextMedia = nextProps.item.media_url || nextProps.item.url || (nextProps.item.media_urls && nextProps.item.media_urls[0]);
    
    return prevMedia === nextMedia && 
           prevProps.className === nextProps.className;
  }
  
  return false;
});

UniversalMedia.displayName = 'UniversalMedia';

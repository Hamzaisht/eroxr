
import { forwardRef, useState, useEffect, useMemo, useCallback, Ref, memo } from 'react';
import { MediaType, MediaSource } from '@/utils/media/types';
import { MediaRenderer } from './MediaRenderer';
import { extractMediaUrl } from '@/utils/media/urlUtils';

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
  // Create a stable media source object with all possible URL formats
  const mediaSource = useMemo(() => {
    // If item is null or undefined, return empty source
    if (!item) return null;
    
    // If item is a string, assume it's a direct URL
    if (typeof item === 'string') {
      const isVideoUrl = item.match(/\.(mp4|webm|mov|ogv)($|\?)/i);
      const mediaType: MediaType = isVideoUrl ? MediaType.VIDEO : MediaType.IMAGE;
      
      return {
        url: item,
        media_url: item,
        video_url: item,
        media_type: mediaType
      };
    }
    
    // Create a comprehensive object with all possible URL properties
    // This ensures maximum compatibility with different components
    return {
      // Video URLs
      video_url: item.video_url || (item.video_urls && item.video_urls[0]),
      // Image URLs
      media_url: item.media_url || (item.media_urls && item.media_urls[0]),
      // Generic URLs
      url: item.url || item.src,
      // Thumbnail for fallback
      thumbnail_url: item.thumbnail_url,
      // Media type - determine from available URLs if not specified
      media_type: item.media_type || 
                 (item.video_url || (item.video_urls && item.video_urls.length > 0) ? MediaType.VIDEO : 
                 (item.media_url || (item.media_urls && item.media_urls.length > 0) ? MediaType.IMAGE : 
                 MediaType.UNKNOWN)),
      // Additional metadata that might be needed
      creator_id: item.creator_id
    };
  }, [item]);

  // Check if we have any valid URL
  const hasValidUrl = useMemo(() => {
    if (!mediaSource) return false;
    return !!extractMediaUrl(mediaSource);
  }, [mediaSource]);
  
  // Log debug info in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !hasValidUrl) {
      console.warn('UniversalMedia: No valid URL found in item:', item);
    }
  }, [hasValidUrl, item]);
  
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
  
  // Create style object for object-fit property
  const styleProps = useMemo(() => ({
    style: { objectFit }
  }), [objectFit]);

  // If no valid media source, show empty state
  if (!mediaSource || !hasValidUrl) {
    return (
      <div className={`${className} flex items-center justify-center bg-black/20`}>
        <p className="text-sm text-gray-400">Media not available</p>
      </div>
    );
  }

  return (
    <MediaRenderer
      ref={ref}
      src={mediaSource}
      type={mediaSource.media_type as MediaType}
      className={className}
      autoPlay={autoPlay}
      controls={controls}
      muted={muted}
      loop={loop}
      poster={poster || mediaSource.thumbnail_url}
      showWatermark={showWatermark}
      onClick={onClick}
      onLoad={handleLoad}
      onError={handleError}
      onEnded={handleEnded}
      onTimeUpdate={handleTimeUpdate}
      maxRetries={maxRetries}
      allowRetry={true}
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
    return !prevProps.item && !nextProps.item;
  }
  
  // For object types, check the key URL properties
  const prevUrl = extractMediaUrl(prevProps.item);
  const nextUrl = extractMediaUrl(nextProps.item);
  
  return prevUrl === nextUrl && 
         prevProps.autoPlay === nextProps.autoPlay &&
         prevProps.className === nextProps.className;
});

UniversalMedia.displayName = 'UniversalMedia';


import { forwardRef, useState, useEffect, useCallback, useMemo, Ref } from 'react';
import { MediaType, MediaSource } from '@/utils/media/types';
import { determineMediaType, extractMediaUrl } from '@/utils/media/mediaUtils';
import { getPlayableMediaUrl } from '@/utils/media/urlUtils';

interface UniversalMediaProps {
  item: MediaSource | string;
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

export const UniversalMedia = forwardRef(({
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
  
  // Extract media information from various sources/formats
  const { mediaUrl, mediaType, fallbackUrl } = useMemo(() => {
    if (!item) return { mediaUrl: null, mediaType: MediaType.UNKNOWN, fallbackUrl: null };
    
    // Determine media type using the utility function
    const type = determineMediaType(item);
    
    // Extract URL
    const url = extractMediaUrl(item);
    
    // Extract fallback URL if available
    let fallback: string | null = null;
    
    // If it's a media source object, look for fallbacks
    if (typeof item !== 'string') {
      const source = item as MediaSource;
      
      // Handle video_urls safely
      if (source.video_urls && Array.isArray(source.video_urls) && source.video_urls.length > 1) {
        fallback = source.video_urls[1];
      } 
      // Handle media_urls safely
      else if (source.media_urls && Array.isArray(source.media_urls) && source.media_urls.length > 1) {
        fallback = source.media_urls[1];
      }
      // Set thumbnail as fallback for videos
      else if (type === MediaType.VIDEO) {
        fallback = source.video_thumbnail_url || source.thumbnail_url || source.poster || null;
      }
    }
    
    return { mediaUrl: url, mediaType: type, fallbackUrl: fallback };
  }, [item]);
  
  // Handle timeUpdate events for videos
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (onTimeUpdate) {
      onTimeUpdate(e.currentTarget.currentTime);
    }
  };

  // Render based on media type
  if (mediaType === MediaType.VIDEO) {
    return (
      <div className="relative w-full h-full">
        <video
          ref={ref as React.RefObject<HTMLVideoElement>}
          src={mediaUrl || undefined}
          className={className}
          style={{ objectFit }}
          autoPlay={autoPlay}
          controls={controls}
          muted={muted}
          loop={loop}
          poster={poster || fallbackUrl || undefined}
          onClick={onClick}
          onLoadedData={onLoad}
          onError={onError}
          onEnded={onEnded}
          onTimeUpdate={handleTimeUpdate}
          playsInline
        />
        
        {showWatermark && (
          <div className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-1.5 py-0.5 rounded">
            eroxr
          </div>
        )}
      </div>
    );
  }
  
  // For images and other media types
  return (
    <div className="relative w-full h-full">
      <img
        ref={ref as React.RefObject<HTMLImageElement>}
        src={mediaUrl || fallbackUrl || undefined}
        className={className}
        style={{ objectFit }}
        onClick={onClick}
        onLoad={onLoad}
        onError={onError}
        alt={alt}
      />
      
      {showWatermark && (
        <div className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-1.5 py-0.5 rounded">
          eroxr
        </div>
      )}
    </div>
  );
});

UniversalMedia.displayName = 'UniversalMedia';

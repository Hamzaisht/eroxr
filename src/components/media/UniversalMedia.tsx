
import { forwardRef, Ref, useMemo } from 'react';
import { MediaType, MediaSource } from '@/utils/media/types';
import { MediaRenderer } from './MediaRenderer';

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
    
    // Handle string URL directly
    if (typeof item === 'string') {
      return { mediaUrl: item, mediaType: MediaType.UNKNOWN, fallbackUrl: null };
    }
    
    // Handle media source object with various possible properties
    const source = item as MediaSource;
    
    // Determine media type
    let type = source.media_type || MediaType.UNKNOWN;
    
    // Extract primary URL based on type or available properties
    let url: string | null = null;
    let fallback: string | null = null;
    
    // Try to get video URL first if it exists
    if (source.video_url) {
      url = source.video_url;
      type = MediaType.VIDEO;
    } 
    // Then try video_urls array
    else if (Array.isArray(source.video_urls) && source.video_urls.length > 0) {
      url = source.video_urls[0];
      type = MediaType.VIDEO;
      
      // Set second video as fallback if available
      if (source.video_urls.length > 1) {
        fallback = source.video_urls[1];
      }
    }
    // Then check for media_url
    else if (source.media_url) {
      url = source.media_url;
      type = type || MediaType.IMAGE;
    }
    // Then check media_urls array
    else if (Array.isArray(source.media_urls) && source.media_urls.length > 0) {
      url = source.media_urls[0];
      type = type || MediaType.IMAGE;
      
      // Set second image as fallback
      if (source.media_urls.length > 1) {
        fallback = source.media_urls[1];
      }
    }
    // Check for generic url properties
    else if (source.url) {
      url = source.url;
    } else if (source.src) {
      url = source.src;
    }
    
    // Set fallback from thumbnails if applicable for videos
    if (type === MediaType.VIDEO && !fallback) {
      fallback = source.video_thumbnail_url || source.thumbnail_url || source.poster || null;
    }
    
    return { mediaUrl: url, mediaType: type, fallbackUrl: fallback };
  }, [item]);
  
  // Handle timeUpdate events for videos
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (onTimeUpdate) {
      onTimeUpdate(e.currentTarget.currentTime);
    }
  };

  return (
    <div className="relative w-full h-full">
      <MediaRenderer
        ref={ref}
        src={mediaUrl}
        type={mediaType}
        fallbackSrc={fallbackUrl}
        className={className}
        autoPlay={autoPlay}
        controls={controls}
        muted={muted}
        loop={loop}
        poster={poster}
        alt={alt}
        objectFit={objectFit}
        onClick={onClick}
        onLoad={onLoad}
        onError={onError}
        onEnded={onEnded}
        maxRetries={maxRetries}
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

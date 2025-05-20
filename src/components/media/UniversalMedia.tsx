
import { forwardRef, Ref, useMemo } from 'react';
import { MediaRenderer } from './MediaRenderer';
import { MediaSource, MediaType } from '@/types/media';
import { normalizeMediaSource } from '@/utils/media/mediaUtils';

interface UniversalMediaProps {
  item: MediaSource | string;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  showWatermark?: boolean;
  showCloseButton?: boolean;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: (error: any) => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  alt?: string;
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
  showCloseButton = false,
  onClick,
  onLoad,
  onError,
  onEnded,
  onTimeUpdate,
  alt = "Media content",
  maxRetries = 2
}: UniversalMediaProps, ref: Ref<HTMLVideoElement | HTMLImageElement>) => {
  // Process the item to ensure it has a url property
  const mediaItem = useMemo(() => {
    const source = normalizeMediaSource(item);
    // If poster prop was passed, add it to the mediaSource
    if (poster && typeof source === 'object') {
      source.poster = poster;
    }
    
    // Convert string type to proper MediaType enum
    if (typeof source.type === 'string') {
      switch(source.type) {
        case 'image': 
          source.type = MediaType.IMAGE;
          break;
        case 'video':
          source.type = MediaType.VIDEO;
          break;
        case 'audio':
          source.type = MediaType.AUDIO;
          break;
        case 'document':
          source.type = MediaType.DOCUMENT;
          break;
        case 'gif':
          source.type = MediaType.GIF;
          break;
        default:
          source.type = MediaType.UNKNOWN;
      }
    }
    
    return source;
  }, [item, poster]);

  return (
    <MediaRenderer
      src={mediaItem}
      className={className}
      autoPlay={autoPlay}
      controls={controls}
      muted={muted}
      loop={loop}
      poster={poster || (typeof mediaItem === 'object' ? mediaItem.poster : undefined)}
      showWatermark={showWatermark}
      showCloseButton={showCloseButton}
      onClick={onClick}
      onLoad={onLoad}
      onError={onError}
      onEnded={onEnded}
      onTimeUpdate={onTimeUpdate}
      allowRetry={true}
      maxRetries={maxRetries}
      ref={ref}
    />
  );
});

UniversalMedia.displayName = 'UniversalMedia';

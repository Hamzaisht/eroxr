
import { forwardRef, Ref, useMemo } from 'react';
import { MediaRenderer } from './MediaRenderer';
import { MediaType, MediaSource } from '@/utils/media/types';
import { extractMediaUrl } from '@/utils/media/urlUtils';
import { normalizeMediaSource } from '@/utils/media/types';
import { determineMediaType } from '@/utils/media/mediaUtils';

interface UniversalMediaProps {
  /** The media item to display */
  item: MediaSource | string;
  
  /** CSS class for styling */
  className?: string;
  
  /** Auto-play media (for video/audio) */
  autoPlay?: boolean;
  
  /** Show media controls (for video/audio) */
  controls?: boolean;
  
  /** Mute media (for video/audio) */
  muted?: boolean;
  
  /** Loop media (for video/audio) */
  loop?: boolean;
  
  /** Poster image URL (for video) */
  poster?: string;
  
  /** Show watermark on media */
  showWatermark?: boolean;
  
  /** Click handler */
  onClick?: () => void;
  
  /** Error handler */
  onError?: () => void;
  
  /** Load complete handler */
  onLoad?: () => void;
  
  /** Media ended handler */
  onEnded?: () => void;
  
  /** Time update handler */
  onTimeUpdate?: (time?: number) => void;
  
  /** Alt text for image (for accessibility) */
  alt?: string;

  /** Maximum number of retries on error */
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
    const normalized = normalizeMediaSource(item);
    
    // If no media_type is specified, try to determine it
    if (!normalized.media_type) {
      normalized.media_type = determineMediaType(normalized);
    }
    
    return normalized;
  }, [item]);

  return (
    <MediaRenderer
      src={mediaItem}
      type={mediaItem.media_type}
      className={className}
      autoPlay={autoPlay}
      controls={controls}
      muted={muted}
      loop={loop}
      poster={poster || mediaItem.poster}
      showWatermark={showWatermark}
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

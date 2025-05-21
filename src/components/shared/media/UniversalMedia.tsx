
import { forwardRef, Ref, useMemo } from 'react';
import { MediaRenderer } from '@/components/media/MediaRenderer';
import { MediaSource, MediaType, MediaAccessLevel } from '@/utils/media/types';
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
  onClick?: () => void;
  onLoad?: () => void;
  onError?: (error?: any) => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  alt?: string;
  maxRetries?: number;
  accessLevel?: MediaAccessLevel;
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
  objectFit = 'cover',
  alt = "Media content",
  maxRetries = 2,
  accessLevel
}: UniversalMediaProps, ref: Ref<HTMLVideoElement | HTMLImageElement>) => {
  // Process the item to ensure it has a url property
  const mediaItem = useMemo(() => {
    const normalized = normalizeMediaSource(item);
    // If poster prop was passed, add it to the mediaSource
    if (poster) {
      normalized.poster = poster;
    }
    // If access level is explicitly provided, use it
    if (accessLevel) {
      normalized.access_level = accessLevel;
    }
    return normalized as MediaSource;
  }, [item, poster, accessLevel]);

  return (
    <MediaRenderer
      src={mediaItem}
      className={className}
      autoPlay={autoPlay}
      controls={controls}
      muted={muted}
      loop={loop}
      poster={poster || (mediaItem && typeof mediaItem === 'object' && 'poster' in mediaItem ? mediaItem.poster : undefined)}
      showWatermark={showWatermark}
      onClick={onClick}
      onLoad={onLoad}
      onError={onError}
      onEnded={onEnded}
      onTimeUpdate={onTimeUpdate}
      ref={ref}
      allowRetry={true}
      maxRetries={maxRetries}
    />
  );
});

UniversalMedia.displayName = 'UniversalMedia';

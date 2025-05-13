
import { forwardRef, Ref, useMemo } from 'react';
import { MediaRenderer } from '@/components/media/MediaRenderer';
import { MediaSource, MediaType, MediaOptions } from '@/utils/media/types';
import { mediaOrchestrator } from '@/utils/media/mediaUtils';
import { extractMediaUrl } from '@/utils/media/urlUtils';

interface UniversalMediaProps extends MediaOptions {
  item: MediaSource | string;
  showWatermark?: boolean;
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
  maxRetries = 2
}: UniversalMediaProps, ref: Ref<HTMLVideoElement | HTMLImageElement>) => {
  const mediaId = useMemo(() => mediaOrchestrator.createMediaId(item), [item]);
  
  // Process the item to ensure it has a url property
  const mediaItem = useMemo(() => {
    // Skip processing if we got a string
    if (typeof item === 'string') {
      return { url: item };
    }
    
    // If item already has a url property, use it as is
    if (item.url) {
      return item;
    }
    
    // Extract the main URL from different possible properties
    const mainUrl = extractMediaUrl(item);
    
    // Create a new media item with the url property
    return {
      ...item,
      url: mainUrl
    };
  }, [item]);

  // Register with the orchestrator to preload
  useMemo(() => {
    if (mediaId) {
      mediaOrchestrator.registerMediaRequest(mediaItem);
    }
  }, [mediaItem, mediaId]);

  return (
    <MediaRenderer
      src={mediaItem}
      className={className}
      autoPlay={autoPlay}
      controls={controls}
      muted={muted}
      loop={loop}
      poster={poster}
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

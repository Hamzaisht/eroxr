
import { forwardRef, Ref, useMemo } from 'react';
import { MediaRenderer } from '@/components/media/MediaRenderer';
import { MediaSource, MediaType, MediaOptions } from '@/utils/media/types';
import { mediaOrchestrator } from '@/utils/media/mediaOrchestrator';

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
  onTimeUpdate
}: UniversalMediaProps, ref: Ref<HTMLVideoElement | HTMLImageElement>) => {
  const mediaId = useMemo(() => mediaOrchestrator.createMediaId(item), [item]);
  
  // Create a minimal stable reference for the media item to prevent re-renders
  const mediaItem = useMemo(() => {
    // Skip processing if we got a string
    if (typeof item === 'string') {
      return item;
    }
    
    // Determine media type
    const mediaType = item.media_type || 
                     (item.video_url ? MediaType.VIDEO : 
                     item.media_url ? MediaType.IMAGE : MediaType.UNKNOWN);
    
    // Create a stable minimal reference with only the essential properties
    if (mediaType === MediaType.VIDEO) {
      return {
        video_url: item.video_url || (item.video_urls && item.video_urls[0]),
        media_type: MediaType.VIDEO,
        creator_id: item.creator_id,
        thumbnail_url: item.thumbnail_url,
        mediaId, // Include our stable ID
        // Include all possible URL properties to ensure compatibility
        url: item.url,
        media_url: item.media_url,
        src: item.src
      };
    } else {
      return {
        media_url: item.media_url || item.url || (item.media_urls && item.media_urls[0]),
        media_type: mediaType,
        creator_id: item.creator_id,
        mediaId, // Include our stable ID
        // Include video-related properties as fallbacks
        video_url: item.video_url,
        thumbnail_url: item.thumbnail_url,
        url: item.url,
        src: item.src
      };
    }
  }, [item, mediaId]);

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
      maxRetries={1} // Reduce retries to prevent too many loading attempts
    />
  );
});

UniversalMedia.displayName = 'UniversalMedia';

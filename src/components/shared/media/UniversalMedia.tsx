
import { forwardRef, Ref, useMemo } from 'react';
import { MediaRenderer } from '@/components/media/MediaRenderer';
import { MediaSource, MediaOptions, MediaType } from '@/utils/media/types';
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
  // Generate a stable media ID using our orchestrator
  const mediaId = useMemo(() => mediaOrchestrator.createMediaId(item), [item]);
  
  // Create stable media item reference
  const mediaItem = useMemo(() => {
    if (typeof item === 'string') {
      return item;
    }
    
    // Create a minimal stable reference to prevent unnecessary re-renders
    const mediaType = item.media_type || 
                     (item.video_url ? MediaType.VIDEO : 
                     item.media_url ? MediaType.IMAGE : MediaType.UNKNOWN);
                     
    // Return only the essential properties needed
    if (mediaType === MediaType.VIDEO) {
      return {
        video_url: item.video_url || (item.video_urls && item.video_urls[0]),
        media_type: MediaType.VIDEO,
        creator_id: item.creator_id,
        thumbnail_url: item.thumbnail_url
      };
    } else {
      return {
        media_url: item.media_url || item.url || (item.media_urls && item.media_urls[0]),
        media_type: mediaType,
        creator_id: item.creator_id
      };
    }
  }, [mediaId]); // Use mediaId as dependency instead of item to ensure stable references

  // Register this media with our orchestrator
  useMemo(() => {
    mediaOrchestrator.registerMediaRequest(mediaItem);
  }, [mediaItem]);

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
      maxRetries={2}
    />
  );
});

UniversalMedia.displayName = 'UniversalMedia';

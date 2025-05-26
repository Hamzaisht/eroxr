
import { forwardRef, Ref, useMemo, useState } from 'react';
import { MediaRenderer } from './MediaRenderer';
import { MediaSource, MediaType, MediaOptions, MediaAccessLevel } from '@/utils/media/types';
import { normalizeMediaSource } from '@/utils/media/mediaUtils';
import { useToast } from "@/hooks/use-toast";
import { isValidMediaUrl } from '@/utils/media/mediaOrchestrator';
import { AlertCircle } from 'lucide-react';
import { ToastAction } from "@/components/ui/toast";

interface UniversalMediaProps extends MediaOptions {
  item: any; // Accepting various formats for backward compatibility
  showWatermark?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  alt?: string;
  maxRetries?: number;
  accessLevel?: MediaAccessLevel;
  compact?: boolean;
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
  accessLevel,
  compact = false
}: UniversalMediaProps, ref: Ref<HTMLVideoElement | HTMLImageElement>) => {
  const { toast } = useToast();
  const [retryCount, setRetryCount] = useState(0);
  
  // Process the item to ensure it has a url property
  const mediaItem = useMemo(() => {
    try {
      const normalized = normalizeMediaSource(item);
      
      // If poster prop was passed, add it to the mediaSource
      if (poster) {
        normalized.poster = poster;
      }
      
      // If access level is explicitly provided, use it
      if (accessLevel) {
        normalized.access_level = accessLevel;
      }
      
      return normalized;
    } catch (error) {
      console.error("Error normalizing media source:", error, item);
      return { url: '', type: MediaType.UNKNOWN };
    }
  }, [item, poster, accessLevel]);
  
  // Early validation of URL
  if (!isValidMediaUrl(mediaItem?.url)) {
    if (compact) {
      return (
        <div className="flex items-center justify-center h-32 w-full bg-luxury-darker/50 rounded-lg border border-luxury-neutral/10">
          <div className="text-center p-4">
            <AlertCircle className="h-6 w-6 text-luxury-neutral/50 mx-auto mb-2" />
            <p className="text-xs text-luxury-neutral/70">Media not available</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-4 bg-black/10 text-center">
        <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
        <p className="text-sm text-gray-200">Invalid media source</p>
      </div>
    );
  }
  
  const handleError = (error?: any) => {
    // For compact mode, don't show toasts - just silently handle errors
    if (!compact) {
      console.error("Media loading error:", error, mediaItem);
      
      // Track retry count
      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);
      
      // If we've exceeded max retries, display toast error (only for non-compact)
      if (newRetryCount >= maxRetries) {
        toast({
          title: "Media failed to load",
          description: "Please try again later",
          variant: "destructive",
          action: (
            <ToastAction altText="Retry" onClick={() => window.location.reload()}>
              Retry
            </ToastAction>
          ),
        });
      }
    }
    
    // Call the original error handler if provided
    if (onError) {
      onError(error);
    }
  };

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
      onError={handleError}
      onEnded={onEnded}
      onTimeUpdate={onTimeUpdate}
      ref={ref}
      allowRetry={retryCount < maxRetries}
      maxRetries={maxRetries}
      compact={compact}
    />
  );
});

UniversalMedia.displayName = 'UniversalMedia';


import { forwardRef, Ref } from 'react';
import { CoreMediaRenderer } from './CoreMediaRenderer';
import { MediaType } from '@/types/media';

interface OptimizedUniversalMediaProps {
  item: any;
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
  compact?: boolean;
  fallbackMessage?: string;
}

export const OptimizedUniversalMedia = forwardRef(({
  item,
  className = "",
  autoPlay = false,
  controls = true,
  muted = true,
  loop = false,
  poster,
  onClick,
  onLoad,
  onError,
  onEnded,
  onTimeUpdate,
  maxRetries = 2,
  compact = false,
  fallbackMessage
}: OptimizedUniversalMediaProps, ref: Ref<HTMLVideoElement | HTMLImageElement>) => {

  const finalFallbackMessage = fallbackMessage || (compact ? "No media" : "Media not available");

  return (
    <CoreMediaRenderer
      source={item}
      className={className}
      autoPlay={autoPlay}
      controls={controls}
      muted={muted}
      loop={loop}
      poster={poster}
      onClick={onClick}
      onLoad={onLoad}
      onError={onError}
      onEnded={onEnded}
      onTimeUpdate={onTimeUpdate}
      allowRetry={true}
      maxRetries={maxRetries}
      fallbackMessage={finalFallbackMessage}
    />
  );
});

OptimizedUniversalMedia.displayName = 'OptimizedUniversalMedia';

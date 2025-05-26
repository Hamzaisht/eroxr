
import { forwardRef, Ref } from 'react';
import { ReliableMediaRenderer } from './ReliableMediaRenderer';

interface UniversalMediaProps {
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
}

export const UniversalMedia = forwardRef(({
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
  compact = false
}: UniversalMediaProps, ref: Ref<HTMLVideoElement | HTMLImageElement>) => {

  return (
    <ReliableMediaRenderer
      source={item}
      className={className}
      autoPlay={autoPlay}
      controls={controls}
      muted={muted}
      onClick={onClick}
      fallbackMessage={compact ? "No media" : "Media not available"}
    />
  );
});

UniversalMedia.displayName = 'UniversalMedia';

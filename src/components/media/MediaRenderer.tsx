
import React, { useRef, useState, useEffect } from 'react';
import { MediaType } from "@/types/media";

// Define the MediaRendererProps interface
export interface MediaRendererProps {
  children?: React.ReactNode;
  src?: any;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  showWatermark?: boolean;
  onLoad?: () => void;
  onError?: (error: any) => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  allowRetry?: boolean;
  maxRetries?: number;
  ref?: React.Ref<HTMLVideoElement | HTMLImageElement>;
}

export const MediaRenderer: React.FC<MediaRendererProps> = ({ 
  children, 
  className = "",
  src,
  autoPlay = false,
  controls = true,
  muted = true,
  loop = false,
  poster,
  showWatermark = false,
  onLoad,
  onError,
  onEnded,
  onTimeUpdate,
  allowRetry = false,
  maxRetries = 2,
  ...rest 
}) => {
  const [isSupported, setIsSupported] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const mediaType = src?.type || MediaType.UNKNOWN;

  useEffect(() => {
    const checkSupport = () => {
      if (!containerRef.current) return;

      // Basic check - expand this as needed
      if (mediaType === MediaType.VIDEO) {
        const element = document.createElement('video');
        setIsSupported(typeof element.canPlayType === "function");
      } else if (mediaType === MediaType.AUDIO) {
        const element = document.createElement('audio');
        setIsSupported(typeof element.canPlayType === "function");
      } else {
        // Image is assumed to be supported
        setIsSupported(true);
      }
    };

    checkSupport();
  }, [mediaType]);

  if (!isSupported) {
    return (
      <div className={className}>
        <p>Unsupported media type: {mediaType}</p>
      </div>
    );
  }

  const renderMedia = () => {
    if (!src) return null;
    
    const url = src.url || '';
    
    if (mediaType === MediaType.VIDEO) {
      return (
        <video 
          src={url}
          className={className}
          autoPlay={autoPlay}
          controls={controls}
          muted={muted}
          loop={loop}
          poster={poster || src.poster || src.thumbnail}
          onLoadedMetadata={onLoad}
          onError={onError}
          onEnded={onEnded}
          {...rest}
        />
      );
    } else if (mediaType === MediaType.IMAGE || mediaType === MediaType.GIF) {
      return (
        <img 
          src={url} 
          className={className}
          onLoad={onLoad}
          onError={onError}
          alt="Media content"
          {...rest}
        />
      );
    }
    
    return <div>Unsupported media format</div>;
  };

  return (
    <div className={className} ref={containerRef}>
      {children || renderMedia()}
    </div>
  );
};

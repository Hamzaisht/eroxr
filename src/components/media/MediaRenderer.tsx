
import React, { useRef, useState, useEffect } from 'react';
import { MediaType } from "@/utils/media/types";

// Define the MediaRendererProps interface if it's not exported elsewhere
export interface MediaRendererProps {
  children?: React.ReactNode;
  mediaType: MediaType;
  className?: string;
  src?: any;
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

export const MediaRenderer: React.FC<MediaRendererProps> = ({ children, mediaType, className, ...rest }) => {
  const [isSupported, setIsSupported] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className={className} ref={containerRef}>
      {children}
    </div>
  );
};

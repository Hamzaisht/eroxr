import React, { useRef, useState, useEffect } from 'react';
import { MediaType } from "@/utils/media/types";
// Import or define MediaRendererProps directly in this file
import { ReactNode } from "react";

// Define the MediaRendererProps interface if it's not exported elsewhere
export interface MediaRendererProps {
  children?: ReactNode;
  mediaType: MediaType;
  className?: string;
}

export const MediaRenderer: React.FC<MediaRendererProps> = ({ children, mediaType, className }) => {
  const [isSupported, setIsSupported] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkSupport = () => {
      if (!containerRef.current) return;

      // Basic check - expand this as needed
      const element = document.createElement(mediaType);
      setIsSupported(typeof element.canPlayType === "function");
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

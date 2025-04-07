
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getEnlargedImageStyles, generateSrcSet, getResponsiveSizes } from "@/lib/image-utils";
import { Loader2, X, Maximize2, Minimize2 } from "lucide-react";
import { useState, useRef } from "react";
import { WatermarkOverlay } from "./WatermarkOverlay";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { MediaControls } from "./MediaControls";

interface MediaContentProps {
  url: string;
  isVideo: boolean;
  creatorId?: string;
  username?: string;
  onClose?: () => void;
  onMediaClick?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  showControls?: boolean;
}

export const MediaContent = ({ 
  url, 
  isVideo, 
  creatorId,
  username,
  onClose, 
  onMediaClick,
  onNext,
  onPrevious,
  showControls = false
}: MediaContentProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleMediaClick = () => {
    if (onMediaClick) {
      onMediaClick();
    } else {
      setIsZoomed(!isZoomed);
    }
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col bg-black/95 rounded-lg overflow-hidden"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Header with close button and fullscreen controls */}
      <div className="flex items-center justify-end p-2 bg-black/80 z-10">
        {!isFullscreen && (
          <button 
            onClick={toggleFullscreen}
            className="p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors mr-2"
            aria-label="Toggle fullscreen"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        )}
        
        {isFullscreen && (
          <button 
            onClick={toggleFullscreen}
            className="p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors mr-2"
            aria-label="Exit fullscreen"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
        )}
        
        {onClose && (
          <button 
            onClick={onClose}
            className="p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* Media navigation controls */}
      <MediaControls 
        showControls={!!showControls && !!onNext && !!onPrevious} 
        onNext={onNext || (() => {})} 
        onPrevious={onPrevious || (() => {})} 
      />
      
      {/* Media content container */}
      <div 
        className={cn(
          "flex-1 flex items-center justify-center relative bg-black/75",
          isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
        )}
        style={{ 
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          userSelect: 'none',
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
        )}
        
        {/* Video or Image content */}
        <div className={cn(
          "relative max-w-full max-h-[80vh] flex items-center justify-center",
          isZoomed ? "scale-150 transition-transform duration-300" : "transition-transform duration-300"
        )}>
          {isVideo ? (
            <VideoPlayer
              url={url}
              className="max-w-full max-h-[80vh]"
              showCloseButton={false}
              creatorId={creatorId}
              onClose={() => {}}
              autoPlay={true}
            />
          ) : (
            <img
              src={url}
              alt="Media content"
              className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-lg"
              style={getEnlargedImageStyles()}
              srcSet={generateSrcSet(url)}
              sizes={getResponsiveSizes()}
              loading="eager"
              decoding="sync"
              onClick={handleMediaClick}
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
              draggable="false"
            />
          )}
          
          {/* Watermark overlay */}
          <WatermarkOverlay username={username || ''} creatorId={creatorId} />
        </div>
      </div>
    </motion.div>
  );
};

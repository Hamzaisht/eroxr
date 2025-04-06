
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getEnlargedImageStyles, generateSrcSet, getResponsiveSizes } from "@/lib/image-utils";
import { Loader2, ZoomIn, ZoomOut } from "lucide-react";
import { useState, useRef } from "react";
import { WatermarkOverlay } from "./WatermarkOverlay";

interface MediaContentProps {
  url: string;
  isVideo: boolean;
  creatorId?: string;
}

export const MediaContent = ({ url, isVideo, creatorId }: MediaContentProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full flex items-center justify-center p-4 bg-black/75 relative"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      )}
      
      {isVideo ? (
        <div className="relative max-w-[95vw] max-h-[95vh]">
          <video
            ref={videoRef}
            src={url}
            className={cn(
              "max-w-[95vw] max-h-[95vh] w-auto h-auto object-contain",
              "rounded-lg shadow-xl",
              isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
            )}
            controls
            autoPlay
            playsInline
            preload="auto"
            onLoadedMetadata={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
          <button 
            onClick={toggleZoom} 
            className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full z-20 hover:bg-black/70 transition-colors"
          >
            {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
          </button>
          <WatermarkOverlay username={creatorId} creatorId={creatorId} />
        </div>
      ) : (
        <div className="relative max-w-[95vw] max-h-[95vh]">
          <img
            ref={imageRef}
            src={url}
            alt="Enlarged media"
            className={cn(
              "max-w-[95vw] max-h-[95vh] w-auto h-auto object-contain",
              "rounded-lg shadow-xl",
              isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
            )}
            style={getEnlargedImageStyles()}
            srcSet={generateSrcSet(url)}
            sizes={getResponsiveSizes()}
            loading="eager"
            decoding="sync"
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
            onClick={toggleZoom}
          />
          <button 
            onClick={toggleZoom} 
            className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full z-20 hover:bg-black/70 transition-colors"
          >
            {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
          </button>
          <WatermarkOverlay username={creatorId} creatorId={creatorId} />
        </div>
      )}
    </motion.div>
  );
};

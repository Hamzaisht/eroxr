
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getEnlargedImageStyles, generateSrcSet, getResponsiveSizes } from "@/lib/image-utils";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { WatermarkOverlay } from "./WatermarkOverlay";

interface MediaContentProps {
  url: string;
  isVideo: boolean;
  creatorId?: string;
  onClose?: () => void;
  onMediaClick?: () => void; // Add this prop
}

export const MediaContent = ({ 
  url, 
  isVideo, 
  creatorId, 
  onClose, 
  onMediaClick 
}: MediaContentProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col bg-black/95 rounded-lg overflow-hidden"
    >
      {/* Header with close button */}
      <div className="flex items-center justify-end p-2 bg-black/80">
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
      
      {/* Media content container */}
      <div className="flex-1 flex items-center justify-center relative bg-black/75">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
        )}
        
        {/* Video or Image content */}
        <div className="relative max-w-full max-h-[80vh] flex items-center justify-center">
          {isVideo ? (
            <video
              src={url}
              className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-lg"
              controls
              autoPlay
              playsInline
              preload="auto"
              onLoadedMetadata={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            />
          ) : (
            <img
              src={url}
              alt="Media content"
              className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-lg cursor-pointer"
              style={getEnlargedImageStyles()}
              srcSet={generateSrcSet(url)}
              sizes={getResponsiveSizes()}
              loading="eager"
              decoding="sync"
              onClick={onMediaClick} // Add click handler
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            />
          )}
          
          {/* Watermark overlay */}
          <WatermarkOverlay username={creatorId} creatorId={creatorId} />
        </div>
      </div>
    </motion.div>
  );
};

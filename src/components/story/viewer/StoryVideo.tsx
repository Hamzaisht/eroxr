
import { useEffect, useRef, forwardRef, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, RefreshCw, VolumeX } from "lucide-react";
import { UniversalMedia } from "@/components/media/UniversalMedia";

interface StoryVideoProps {
  videoUrl: string;
  onEnded: () => void;
  isPaused: boolean;
  creatorId: string;
  onError?: () => void;
}

export const StoryVideo = forwardRef<HTMLVideoElement, StoryVideoProps>(
  ({ videoUrl, onEnded, isPaused, creatorId, onError }, ref) => {
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    
    const mediaItem = {
      video_url: videoUrl,
      creator_id: creatorId,
      media_type: "video"
    };
    
    const handleError = () => {
      console.error(`Story video loading error: ${videoUrl}`);
      setLoadError(true);
      setIsLoading(false);
      if (onError) onError();
    };
    
    const handleLoad = () => {
      console.log(`Story video loaded: ${videoUrl}`);
      setIsLoading(false);
      setLoadError(false);
    };
    
    const handleRetry = () => {
      console.log(`Retrying video load: ${videoUrl}`);
      setIsLoading(true);
      setLoadError(false);
    };
    
    return (
      <div className="relative w-full h-full bg-black">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-luxury-primary animate-spin" />
          </div>
        )}
        
        {loadError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
            <p className="text-gray-200 mb-4">Failed to load video</p>
            <button 
              onClick={handleRetry}
              className="flex items-center gap-2 px-4 py-2 bg-luxury-primary/80 hover:bg-luxury-primary text-white rounded-md"
            >
              <RefreshCw className="h-4 w-4" /> 
              Retry
            </button>
          </motion.div>
        )}
        
        <UniversalMedia
          ref={ref}
          item={mediaItem}
          className="w-full h-full object-contain"
          autoPlay={!isPaused && !isLoading && !loadError}
          controls={false}
          onError={handleError}
          onLoad={handleLoad}
          onEnded={onEnded}
        />
        
        {!isLoading && !loadError && (
          <div className="absolute bottom-4 right-4 bg-black/50 rounded-full p-2">
            <VolumeX className="h-5 w-5 text-white" />
          </div>
        )}
      </div>
    );
  }
);

StoryVideo.displayName = "StoryVideo";

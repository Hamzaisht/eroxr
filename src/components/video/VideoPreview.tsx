import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { UniversalMedia } from "@/components/media/UniversalMedia";
import { MediaType } from "@/utils/media/types";

interface VideoPreviewProps {
  videoUrl: string;
  className?: string;
}

export const VideoPreview = ({ videoUrl, className }: VideoPreviewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 2;

  const mediaItem = {
    video_url: videoUrl,
    media_type: MediaType.VIDEO
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    console.error('Video preview loading error:', videoUrl);
    
    if (retryCount < MAX_RETRIES) {
      console.log(`Auto-retrying video load (${retryCount + 1}/${MAX_RETRIES})...`);
      setRetryCount(prev => prev + 1);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    setRetryCount(0);
  };

  if (hasError) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          "bg-red-500/10 flex flex-col items-center justify-center gap-2",
          className
        )}
      >
        <AlertCircle className="w-6 h-6 text-red-500" />
        <span className="text-xs text-red-500">Failed to load video</span>
        <button 
          onClick={handleRetry}
          className="flex items-center text-xs gap-1 px-2 py-1 mt-1 bg-luxury-dark/50 hover:bg-luxury-dark rounded text-luxury-neutral/80"
        >
          <RefreshCw className="w-3 h-3" /> Retry
        </button>
      </motion.div>
    );
  }

  return (
    <>
      {isLoading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            "bg-luxury-dark/60 flex flex-col items-center justify-center",
            className
          )}
        >
          <Loader2 className="w-6 h-6 animate-spin text-luxury-primary" />
        </motion.div>
      )}
      <motion.div
        className={cn(
          className,
          isLoading ? "hidden" : "block"
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <UniversalMedia
          item={mediaItem}
          className="w-full h-full object-cover"
          onLoad={handleLoad}
          onError={handleError}
          autoPlay={true}
          controls={false}
        />
      </motion.div>
    </>
  );
};


import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StoryMediaDisplayProps {
  mediaUrl: string | null;
  isVideo: boolean;
  onMediaEnd?: () => void;
  onMediaLoad?: () => void;
  onMediaError?: () => void;
  isPaused?: boolean;
}

export const StoryMediaDisplay = ({
  mediaUrl,
  isVideo,
  onMediaEnd,
  onMediaLoad,
  onMediaError,
  isPaused = false
}: StoryMediaDisplayProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    onMediaLoad?.();
  }, [onMediaLoad]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onMediaError?.();
  }, [onMediaError]);

  const retryLoad = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
    // Force reload by updating the src
    if (videoRef.current && isVideo) {
      videoRef.current.load();
    }
  }, [isVideo]);

  if (!mediaUrl || hasError) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <p className="text-lg mb-2">Unable to load story</p>
        <p className="text-sm text-white/60 mb-4">This content may be unavailable</p>
        <Button onClick={retryLoad} variant="outline" className="text-white border-white/40">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black">
      {/* Background blur for aspect ratio fill */}
      <div className="absolute inset-0">
        {isVideo ? (
          <video
            src={mediaUrl}
            className="w-full h-full object-cover blur-xl opacity-30"
            muted
            loop
            autoPlay={false}
          />
        ) : (
          <img
            src={mediaUrl}
            alt=""
            className="w-full h-full object-cover blur-xl opacity-30"
          />
        )}
      </div>

      {/* Main media content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {isVideo ? (
          <video
            ref={videoRef}
            src={mediaUrl}
            className="w-full h-full object-contain"
            autoPlay={!isPaused}
            muted={false}
            onLoadedData={handleLoad}
            onError={handleError}
            onEnded={onMediaEnd}
            controls={false}
            playsInline
          />
        ) : (
          <img
            src={mediaUrl}
            alt="Story content"
            className="w-full h-full object-contain"
            onLoad={handleLoad}
            onError={handleError}
          />
        )}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

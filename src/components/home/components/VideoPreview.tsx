
import { Loader2, AlertCircle, X, Play } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RefObject, useState, useEffect } from "react";

interface VideoPreviewProps {
  previewUrl: string | null;
  videoRef: RefObject<HTMLVideoElement>;
  isPreviewLoading: boolean;
  previewError: string | null;
  onVideoLoad: () => void;
  onVideoError: () => void;
  onClear: () => void;
}

export const VideoPreview = ({
  previewUrl,
  videoRef,
  isPreviewLoading,
  previewError,
  onVideoLoad,
  onVideoError,
  onClear
}: VideoPreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Auto-play the video when it's loaded
  useEffect(() => {
    if (videoRef.current && previewUrl && !isPreviewLoading && !previewError) {
      // Try to play the video automatically
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            // Auto-play was prevented, likely due to browser restrictions
            console.warn("Autoplay prevented:", error);
            // Mute the video and try again as most browsers allow muted autoplay
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().catch(e => {
                console.error("Failed to play even when muted:", e);
              });
            }
          });
      }
    }
  }, [previewUrl, isPreviewLoading, previewError, videoRef]);

  const togglePlayback = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error("Error playing video:", err);
        });
    }
  };

  if (!previewUrl) return null;

  return (
    <div className="relative bg-luxury-darker rounded-lg overflow-hidden aspect-[9/16] max-h-[300px]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {isPreviewLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-luxury-darker/80 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
          </div>
        )}
        
        {previewError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-4">
            <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
            <p className="text-sm text-white/90 text-center">{previewError}</p>
            <Button
              onClick={onClear}
              variant="outline"
              className="mt-4"
              size="sm"
            >
              Select Another Video
            </Button>
          </div>
        ) : (
          <div
            className="relative w-full h-full"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <video 
              ref={videoRef}
              src={previewUrl} 
              className="w-full h-full object-contain"
              controls={false}
              playsInline
              loop
              onLoadedData={onVideoLoad}
              onError={onVideoError}
            />
            
            {/* Play/pause overlay */}
            {(isHovering || !isPlaying) && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
                onClick={togglePlayback}
              >
                {!isPlaying && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="bg-black/50 hover:bg-black/70 text-white rounded-full h-12 w-12"
                  >
                    <Play className="h-6 w-6" />
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 rounded-full p-1.5"
          onClick={onClear}
        >
          <X className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
};

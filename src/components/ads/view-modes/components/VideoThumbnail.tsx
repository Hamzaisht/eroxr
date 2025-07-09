
import { AlertCircle, Play } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface VideoThumbnailProps {
  videoUrl?: string;
  isHovered: boolean;
  isMobile: boolean;
  className?: string;
}

export const VideoThumbnail = ({ videoUrl, isHovered, isMobile, className = "" }: VideoThumbnailProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && (isHovered || isMobile) && !hasError) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          setHasError(true);
        });
      }
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isHovered, isMobile, hasError]);

  return (
    <div className={`w-full h-full relative overflow-hidden ${className}`}>
      {videoUrl && !hasError ? (
        <>
          {/* Loading skeleton */}
          {isLoading && (
            <div className="absolute inset-0 bg-gradient-to-br from-luxury-primary/20 to-luxury-secondary/20 animate-pulse flex items-center justify-center">
              <div className="w-16 h-16 bg-luxury-primary/30 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            </div>
          )}
          
          <video
            ref={videoRef}
            src={videoUrl}
            muted
            loop
            playsInline
            preload="metadata"
            className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoadStart={() => setIsLoading(true)}
            onLoadedData={() => setIsLoading(false)}
            onCanPlay={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
          />
          
          {!isHovered && !isMobile && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-200">
              <div className="bg-black/50 rounded-full p-3 backdrop-blur-sm">
                <Play className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-luxury-primary/20 to-luxury-secondary/20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-luxury-primary/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Play className="w-8 h-8 text-luxury-neutral" />
            </div>
            <p className="text-luxury-neutral text-sm font-medium">Video Preview</p>
            <p className="text-luxury-neutral/70 text-xs">Click to view profile</p>
          </div>
        </div>
      )}
    </div>
  );
};

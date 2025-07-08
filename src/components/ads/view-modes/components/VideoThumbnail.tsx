
import { AlertCircle, Play } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface VideoThumbnailProps {
  videoUrl?: string;
  isHovered: boolean;
  isMobile: boolean;
  className?: string;
}

export const VideoThumbnail = ({ videoUrl, isHovered, isMobile, className = "" }: VideoThumbnailProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && (isHovered || isMobile)) {
      videoRef.current.play().catch(() => {
        setHasError(true);
      });
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isHovered, isMobile]);

  // For now, show a placeholder with user's profile photo background
  return (
    <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-luxury-primary/20 to-luxury-secondary/20 relative ${className}`}>
      {videoUrl && !hasError ? (
        <>
          <video
            ref={videoRef}
            src={videoUrl}
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            onLoadStart={() => setIsLoading(true)}
            onLoadedData={() => setIsLoading(false)}
            onError={() => setHasError(true)}
          />
          {!isHovered && !isMobile && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Play className="w-12 h-12 text-white drop-shadow-lg" />
            </div>
          )}
        </>
      ) : (
        <div className="text-center">
          <div className="w-16 h-16 bg-luxury-primary/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <Play className="w-8 h-8 text-luxury-neutral" />
          </div>
          <p className="text-luxury-neutral text-sm font-medium">Video Preview</p>
          <p className="text-luxury-neutral/70 text-xs">Hover to play</p>
        </div>
      )}
    </div>
  );
};

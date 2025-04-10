import { useEffect, useRef, forwardRef, useState } from "react";
import { Loader2, AlertCircle, RefreshCw, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { getUsernameForWatermark } from "@/utils/watermarkUtils";
import '../../../styles/watermark.css';
import { refreshUrl } from "@/utils/mediaUtils";
import { addCacheBuster } from "@/utils/media/getPlayableMediaUrl";

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
    const [retryCount, setRetryCount] = useState(0);
    const [watermarkUsername, setWatermarkUsername] = useState<string>("");
    const [currentSrc, setCurrentSrc] = useState(videoUrl);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const MAX_RETRIES = 2;
    
    const resolvedRef = (ref as React.RefObject<HTMLVideoElement>) || videoRef;
    
    useEffect(() => {
      setCurrentSrc(addCacheBuster(videoUrl));
      
      setIsLoading(true);
      setLoadError(false);
      setRetryCount(0);
      
      getUsernameForWatermark(creatorId).then(name => {
        setWatermarkUsername(name);
      }).catch(error => {
        console.error("Error fetching watermark username:", error);
      });
    }, [videoUrl, creatorId]);
    
    useEffect(() => {
      const video = resolvedRef.current;
      if (!video) return;
      
      const handleLoadedData = () => {
        console.log("Video loaded successfully:", videoUrl);
        setIsLoading(false);
        setLoadError(false);
        
        if (!isPaused) {
          video.play().catch(err => {
            console.warn("Autoplay prevented:", err);
          });
        }
      };
      
      const handleLoadingError = () => {
        console.error(`Video loading error (attempt ${retryCount + 1}/${MAX_RETRIES + 1}):`, currentSrc);
        
        if (retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
          
          setTimeout(() => {
            if (video) {
              const freshUrl = refreshUrl(currentSrc);
              console.log("Retrying with fresh URL:", freshUrl);
              setCurrentSrc(addCacheBuster(freshUrl));
            }
          }, 1000);
        } else {
          setIsLoading(false);
          setLoadError(true);
          
          if (onError) {
            onError();
          }
        }
      };
      
      video.addEventListener("loadeddata", handleLoadedData);
      video.addEventListener("error", handleLoadingError);
      
      return () => {
        video.removeEventListener("loadeddata", handleLoadedData);
        video.removeEventListener("error", handleLoadingError);
      };
    }, [currentSrc, isPaused, onError, retryCount, videoUrl]);
    
    useEffect(() => {
      const video = resolvedRef.current;
      if (!video) return;
      
      if (isPaused) {
        video.pause();
      } else if (!isLoading && !loadError) {
        video.play().catch(err => {
          console.warn("Video play error:", err);
        });
      }
    }, [isPaused, isLoading, loadError]);
    
    const handleEnded = () => {
      if (onEnded) onEnded();
    };
    
    const handleRetry = () => {
      setIsLoading(true);
      setLoadError(false);
      setRetryCount(0);
      
      const freshUrl = refreshUrl(videoUrl);
      setCurrentSrc(addCacheBuster(freshUrl));
    };
    
    return (
      <div className="relative w-full h-full bg-black">
        <video
          ref={resolvedRef}
          className="w-full h-full object-contain"
          src={currentSrc}
          playsInline
          muted
          onEnded={handleEnded}
          style={{
            display: isLoading || loadError ? 'none' : 'block'
          }}
        />
        
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
        
        {!isLoading && !loadError && (
          <div className="absolute bottom-4 right-4 bg-black/50 rounded-full p-2">
            <VolumeX className="h-5 w-5 text-white" />
          </div>
        )}
        
        {!isLoading && !loadError && watermarkUsername && (
          <div className="watermark-overlay">
            www.eroxr.com/@{watermarkUsername}
          </div>
        )}
      </div>
    );
  }
);

StoryVideo.displayName = "StoryVideo";

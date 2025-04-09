
import { useEffect, useRef, forwardRef, useState } from "react";
import { Loader2, AlertCircle, RefreshCw, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { getUsernameForWatermark } from "@/utils/watermarkUtils";
import '../../../styles/watermark.css';
import { refreshUrl, getUrlWithCacheBuster } from "@/utils/mediaUtils";

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
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const MAX_RETRIES = 2;
    
    // Use forwarded ref or internal ref
    const resolvedRef = (ref as React.RefObject<HTMLVideoElement>) || videoRef;
    
    // Apply watermark
    useEffect(() => {
      getUsernameForWatermark(creatorId).then(name => {
        setWatermarkUsername(name);
      }).catch(error => {
        console.error("Error fetching watermark username:", error);
      });
    }, [creatorId]);
    
    // Add cache buster to URL
    const cacheBustedUrl = getUrlWithCacheBuster(videoUrl);
    
    useEffect(() => {
      // Reset state when URL changes
      setIsLoading(true);
      setLoadError(false);
      setRetryCount(0);
      
      const video = resolvedRef.current;
      if (!video) return;
      
      const handleLoadedData = () => {
        setIsLoading(false);
        setLoadError(false);
        
        if (!isPaused) {
          video.play().catch(err => {
            console.warn("Autoplay prevented:", err);
          });
        }
      };
      
      const handleLoadingError = () => {
        console.error(`Video loading error (attempt ${retryCount + 1}/${MAX_RETRIES + 1}):`, cacheBustedUrl);
        
        if (retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
          
          // Wait a moment then retry with a fresh URL
          setTimeout(() => {
            if (video) {
              const freshUrl = refreshUrl(cacheBustedUrl);
              console.log("Retrying with fresh URL:", freshUrl);
              video.src = freshUrl;
              video.load();
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
      
      // Set up event handlers
      video.addEventListener("loadeddata", handleLoadedData);
      video.addEventListener("error", handleLoadingError);
      
      return () => {
        video.removeEventListener("loadeddata", handleLoadedData);
        video.removeEventListener("error", handleLoadingError);
      };
    }, [videoUrl, isPaused, onError, retryCount, cacheBustedUrl]);
    
    // Handle playback state changes
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
      
      const video = resolvedRef.current;
      if (video) {
        const freshUrl = refreshUrl(cacheBustedUrl);
        video.src = freshUrl;
        video.load();
      }
    };
    
    return (
      <div className="relative w-full h-full bg-black">
        {/* Video element */}
        <video
          ref={resolvedRef}
          className="w-full h-full object-contain"
          src={cacheBustedUrl}
          playsInline
          muted
          onEnded={handleEnded}
          style={{
            display: isLoading || loadError ? 'none' : 'block'
          }}
        />
        
        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-luxury-primary animate-spin" />
          </div>
        )}
        
        {/* Error state */}
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
        
        {/* Muted indicator */}
        {!isLoading && !loadError && (
          <div className="absolute bottom-4 right-4 bg-black/50 rounded-full p-2">
            <VolumeX className="h-5 w-5 text-white" />
          </div>
        )}
        
        {/* Watermark */}
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

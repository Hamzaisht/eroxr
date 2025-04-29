
import { useState, useEffect, useRef } from "react";
import { VideoLoadingState } from "./VideoLoadingState";
import { cn } from "@/lib/utils";

interface LazyVideoLoaderProps {
  src: string;
  poster?: string;
  className?: string;
  fallback?: React.ReactNode;
  aspectRatio?: "16/9" | "4/3" | "1/1" | "portrait" | "auto";
  preloadStrategy?: "none" | "metadata" | "auto";
}

export const LazyVideoLoader = ({
  src,
  poster,
  className,
  fallback,
  aspectRatio = "16/9",
  preloadStrategy = "metadata"
}: LazyVideoLoaderProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Setup intersection observer to detect when video is in viewport
  useEffect(() => {
    const currentRef = containerRef.current;
    if (!currentRef) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(currentRef);
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);
  
  // Handle video loading
  useEffect(() => {
    if (!isVisible) return;
    
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const handleLoadedData = () => {
      setIsLoading(false);
    };
    
    const handleError = () => {
      console.error("Error loading video:", src);
      setHasError(true);
      setIsLoading(false);
    };
    
    videoElement.addEventListener("loadeddata", handleLoadedData);
    videoElement.addEventListener("error", handleError);
    
    return () => {
      videoElement.removeEventListener("loadeddata", handleLoadedData);
      videoElement.removeEventListener("error", handleError);
    };
  }, [isVisible, src]);
  
  // Handle retry attempt
  const handleRetry = () => {
    if (retryCount >= 3) return;
    
    setIsLoading(true);
    setHasError(false);
    setRetryCount(prevCount => prevCount + 1);
    
    // Add cache busting parameter to force reload
    const videoElement = videoRef.current;
    if (videoElement) {
      const cacheBuster = `?cache=${Date.now()}`;
      const baseUrl = src.split('?')[0];
      videoElement.src = `${baseUrl}${cacheBuster}`;
      videoElement.load();
    }
  };
  
  const aspectRatioClass = 
    aspectRatio === "16/9" ? "aspect-video" :
    aspectRatio === "4/3" ? "aspect-4/3" :
    aspectRatio === "1/1" ? "aspect-square" :
    aspectRatio === "portrait" ? "aspect-[9/16]" :
    "";

  return (
    <div 
      ref={containerRef} 
      className={cn(
        "relative overflow-hidden bg-luxury-darker/50",
        aspectRatioClass,
        className
      )}
    >
      {isVisible ? (
        <>
          {isLoading && (
            <VideoLoadingState 
              isStalled={isLoading && retryCount > 0} 
              isTimedOut={hasError}
              onRetry={handleRetry}
            />
          )}
          
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            className="w-full h-full object-cover"
            preload={preloadStrategy}
            muted
            playsInline
            autoPlay={false}
          />
        </>
      ) : (
        // Show a placeholder before the video is visible
        fallback || (
          <div className="w-full h-full bg-gradient-to-br from-luxury-dark to-luxury-darker flex items-center justify-center">
            {poster ? (
              <img 
                src={poster} 
                alt="Video thumbnail" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <span className="text-luxury-neutral/40 text-sm">Video will load when visible</span>
            )}
          </div>
        )
      )}
    </div>
  );
};

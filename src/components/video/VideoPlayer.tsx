
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Maximize, X, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { VideoLoadingState } from "./VideoLoadingState";
import { VideoErrorState } from "./VideoErrorState";
import { supabase } from "@/integrations/supabase/client";

interface VideoPlayerProps {
  url: string;
  poster?: string;
  className?: string;
  onError?: () => void;
  autoPlay?: boolean;
  playOnHover?: boolean;
  onClose?: () => void;
  showCloseButton?: boolean;
  isPremium?: boolean;
  videoId?: string;
  creatorId?: string;
  onClick?: () => void;
}

export const VideoPlayer = ({ 
  url, 
  poster, 
  className,
  onError,
  autoPlay = false,
  playOnHover = false,
  onClose,
  showCloseButton = false,
  isPremium = false,
  videoId,
  creatorId,
  onClick
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [errorDetails, setErrorDetails] = useState<string | undefined>(undefined);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Function to get a properly formatted URL from Supabase
  useEffect(() => {
    const getProperUrl = async () => {
      if (!url) {
        setHasError(true);
        setErrorDetails("No video URL provided");
        return;
      }
      
      try {
        // Check if this is already a full URL
        if (url.startsWith('http')) {
          // Add cache-busting to prevent browser caching issues
          const cacheBuster = `${url.includes('?') ? '&' : '?'}_cb=${Date.now()}`;
          setVideoUrl(`${url}${cacheBuster}`);
          return;
        }
        
        // Try to get a public URL if it's a storage path
        if (url.includes('/') && !url.startsWith('http')) {
          const bucket = url.split('/')[0];
          const path = url.substring(bucket.length + 1);
          
          // Try to get public URL first
          const { data: publicUrlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(path);
            
          if (publicUrlData?.publicUrl) {
            const cacheBuster = `${publicUrlData.publicUrl.includes('?') ? '&' : '?'}_cb=${Date.now()}`;
            setVideoUrl(`${publicUrlData.publicUrl}${cacheBuster}`);
            return;
          }
          
          // If not public, try signed URL as fallback
          const { data: signedUrlData, error: signedUrlError } = await supabase.storage
            .from(bucket)
            .createSignedUrl(path, 60 * 60); // 1 hour expiry
            
          if (signedUrlError) {
            console.error("Error creating signed URL:", signedUrlError);
            throw new Error(`Signed URL error: ${signedUrlError.message}`);
          }
          
          if (signedUrlData?.signedUrl) {
            setVideoUrl(signedUrlData.signedUrl);
            return;
          }
        }
        
        // If we got here, use the original URL as fallback
        setVideoUrl(url);
        
      } catch (error: any) {
        console.error("Error processing video URL:", error);
        setHasError(true);
        setErrorDetails(`URL processing error: ${error.message}`);
        if (onError) onError();
      }
    };
    
    getProperUrl();
  }, [url, onError]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      setHasError(false);
      setRetryCount(0);
      setErrorDetails(undefined);
      console.log("Video loaded successfully:", videoUrl);
      if (autoPlay) {
        video.play().catch(e => console.error("Autoplay failed:", e));
      }
    };

    const handleError = (e: Event) => {
      console.error("Video loading error:", e);
      const videoElement = e.target as HTMLVideoElement;
      let errorMsg = "Unknown video error";
      
      // Get detailed error information
      if (videoElement.error) {
        switch (videoElement.error.code) {
          case 1:
            errorMsg = "Video loading aborted";
            break;
          case 2:
            errorMsg = "Network error while loading video";
            break;
          case 3:
            errorMsg = "Video decoding failed";
            break;
          case 4:
            errorMsg = "Video not supported";
            break;
          default:
            errorMsg = `Error code: ${videoElement.error.code}`;
        }
        
        if (videoElement.error.message) {
          errorMsg += ` - ${videoElement.error.message}`;
        }
      }
      
      setErrorDetails(errorMsg);
      setHasError(true);
      setIsLoaded(false);
      if (onError) onError();
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("error", handleError);

    // Reset states when URL changes
    setIsLoaded(false);
    setHasError(false);
    
    // Force load the video with the new URL
    video.load();

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("error", handleError);
    };
  }, [videoUrl, onError, autoPlay]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(error => {
        console.error('Video playback error:', error);
        toast({
          title: "Playback Error",
          description: "Unable to play video. Please try again.",
          variant: "destructive",
        });
      });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleRetry = () => {
    if (!videoRef.current) return;
    
    setIsRetrying(true);
    setHasError(false);
    setRetryCount(prev => prev + 1);
    
    // Create a new URL with cache buster
    const timestamp = Date.now();
    const cacheBuster = `cacheBuster=${timestamp}`;
    const newUrl = videoUrl 
      ? videoUrl.includes('?') 
        ? `${videoUrl}&${cacheBuster}` 
        : `${videoUrl}?${cacheBuster}`
      : url;
    
    // Set new URL to force reload
    setVideoUrl(newUrl);
    
    // Set a timeout to reset retry state if it's taking too long
    setTimeout(() => {
      if (!isLoaded) {
        setIsRetrying(false);
      }
    }, 10000); // 10 second timeout
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } else {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
      toast({
        title: "Fullscreen Error",
        description: "Could not enter fullscreen mode",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!playOnHover || !videoRef.current) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const handleMouseEnter = () => {
      if (videoRef.current) {
        videoRef.current.play().catch(e => console.error("Hover play failed:", e));
        setIsPlaying(true);
      }
    };
    
    const handleMouseLeave = () => {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };
    
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [playOnHover]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative group overflow-hidden bg-luxury-darker w-full h-full",
        className
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {(!isLoaded && !hasError && !isRetrying) && <VideoLoadingState />}
        
        {hasError && !isRetrying && (
          <VideoErrorState 
            onRetry={handleRetry} 
            errorDetails={errorDetails || "Failed to load media content. Please try again later."}
          />
        )}
        
        {isRetrying && <VideoLoadingState />}
        
        {videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            muted={isMuted}
            playsInline
            loop
            className={cn(
              "w-full h-full object-contain",
              (hasError || !isLoaded) && "opacity-0",
              isLoaded && !hasError && "opacity-100 transition-opacity duration-300"
            )}
            style={{
              objectFit: "contain",
              backgroundColor: "black",
              maxWidth: "100%",
              maxHeight: "100%"
            }}
            poster={poster}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onClick={(e) => {
              if (onClick) {
                e.stopPropagation();
                onClick();
              } else {
                e.stopPropagation();
                togglePlay();
              }
            }}
          />
        )}
      </div>
      
      {/* Video controls */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/60 to-transparent z-10"></div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
      
      {showCloseButton && onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-50 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 text-white"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/40"
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-white"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-white"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/40"
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4 text-white" />
            ) : (
              <Volume2 className="h-4 w-4 text-white" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/40"
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
          >
            <Maximize className="h-4 w-4 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
};

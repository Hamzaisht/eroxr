import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Loader2, AlertCircle, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface VideoPlayerProps {
  url: string;
  poster?: string;
  className?: string;
  onError?: () => void;
  isPPV?: boolean;
  ppvAmount?: number;
  postId?: string;
  hasPurchased?: boolean;
}

export const VideoPlayer = ({ 
  url, 
  poster, 
  className = "", 
  onError,
  isPPV = false,
  ppvAmount = 0,
  postId,
  hasPurchased = false
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log("Attempting to load video from URL:", url);

    const handleLoadedData = () => {
      console.log("Video loaded successfully:", url);
      setIsLoading(false);
      setHasError(false);
    };

    const handleError = (e: Event) => {
      const videoElement = e.target as HTMLVideoElement;
      console.error("Video loading error details:", {
        error: videoElement.error,
        networkState: videoElement.networkState,
        readyState: videoElement.readyState,
        url: url
      });
      
      setIsLoading(false);
      setHasError(true);
      if (onError) onError();
      
      toast({
        title: "Error loading video",
        description: "Failed to load video content. Please try again later.",
        variant: "destructive",
      });
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('abort', handleError);

    video.load();

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('abort', handleError);
    };
  }, [url, onError, toast]);

  const handlePurchase = async () => {
    if (!postId) return;
    
    try {
      const { error } = await supabase
        .from('post_purchases')
        .insert([
          {
            post_id: postId,
            user_id: (await supabase.auth.getUser()).data.user?.id,
            amount: ppvAmount
          }
        ]);

      if (error) throw error;

      toast({
        title: "Purchase successful",
        description: "You now have access to this content",
      });

      // Refresh the page or update the state to show the content
      window.location.reload();
    } catch (error) {
      toast({
        title: "Purchase failed",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const togglePlay = () => {
    if (!videoRef.current || hasError) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Error playing video:", error);
          toast({
            title: "Playback Error",
            description: "Unable to play video. Please try again.",
            variant: "destructive",
          });
        });
      }
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-luxury-darker aspect-video rounded-lg ${className}`}>
        <Loader2 className="w-8 h-8 animate-spin text-luxury-primary" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`flex flex-col items-center justify-center bg-luxury-darker aspect-video rounded-lg ${className}`}>
        <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
        <p className="text-sm text-luxury-neutral">Failed to load video</p>
      </div>
    );
  }

  return (
    <div className={cn("relative group", className)}>
      <video
        ref={videoRef}
        src={url}
        poster={poster}
        className={cn(
          "w-full h-full object-cover rounded-lg",
          isPPV && !hasPurchased && "blur-xl"
        )}
        playsInline
        loop
        muted={isMuted}
        preload="metadata"
      />
      
      {isPPV && !hasPurchased ? (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center gap-4 rounded-lg">
          <Lock className="w-12 h-12 text-luxury-primary animate-pulse" />
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-2">Premium Content</h3>
            <p className="text-luxury-neutral mb-4">
              Unlock this content for ${ppvAmount}
            </p>
            <Button
              onClick={handlePurchase}
              className="bg-luxury-primary hover:bg-luxury-primary/90"
            >
              Purchase Access
            </Button>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex gap-4">
            <button
              onClick={togglePlay}
              className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white" />
              )}
            </button>
            <button
              onClick={toggleMute}
              className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-6 h-6 text-white" />
              ) : (
                <Volume2 className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { VideoControls } from "./VideoControls";
import { VideoLoadingState } from "./VideoLoadingState";
import { VideoErrorState } from "./VideoErrorState";
import { supabase } from "@/integrations/supabase/client";

interface VideoPlayerProps {
  url: string;
  poster?: string;
  className?: string;
  index?: number;
  onIndexChange?: (index: number) => void;
  onError?: () => void;
  autoPlay?: boolean;
}

export const VideoPlayer = ({
  url,
  poster,
  className,
  index,
  onIndexChange,
  onError,
  autoPlay = false
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getVideoUrl = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        // If it's already a public URL, use it directly
        if (url.startsWith('http')) {
          setVideoUrl(url);
          return;
        }

        // Get the bucket name from the URL (assuming format: bucket/path)
        const bucketName = url.split('/')[0];
        const filePath = url.split('/').slice(1).join('/');

        // Get the public URL from Supabase storage
        const { data } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        if (data?.publicUrl) {
          console.log("Retrieved public URL:", data.publicUrl);
          setVideoUrl(data.publicUrl);
        } else {
          throw new Error("No public URL found");
        }
      } catch (error) {
        console.error('Error getting video URL:', error);
        setHasError(true);
        if (onError) onError();
        toast({
          title: "Error loading video",
          description: "Could not load video. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (url) {
      getVideoUrl();
    }
  }, [url, onError, toast]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    const handleLoadedData = () => {
      console.log("Video loaded successfully:", videoUrl);
      setIsLoading(false);
      setHasError(false);
      if (autoPlay) {
        video.play().catch(console.error);
      }
    };

    const handleError = (e: Event) => {
      console.error("Video loading error:", e);
      setIsLoading(false);
      setHasError(true);
      if (onError) onError();
      toast({
        title: "Video Error",
        description: "Failed to load video. Please try again later.",
        variant: "destructive",
      });
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.load();

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, [videoUrl, onError, toast, autoPlay]);

  const togglePlay = () => {
    if (!videoRef.current || hasError) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Error playing video:", error);
          setHasError(true);
          if (onError) onError();
          toast({
            title: "Playback Error",
            description: "Unable to play video. Please try again.",
            variant: "destructive",
          });
        });
      }
      if (typeof index !== 'undefined' && onIndexChange) {
        onIndexChange(index);
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

  const handleRetry = () => {
    if (!videoRef.current || !videoUrl) return;
    setHasError(false);
    setIsLoading(true);
    videoRef.current.load();
  };

  if (!videoUrl) {
    return <VideoLoadingState />;
  }

  return (
    <div className={cn(
      "relative group overflow-hidden rounded-lg bg-luxury-darker/50",
      className
    )}>
      {isLoading && <VideoLoadingState />}
      
      {hasError ? (
        <VideoErrorState onRetry={handleRetry} />
      ) : (
        <>
          <video
            ref={videoRef}
            src={videoUrl}
            poster={poster}
            className="w-full h-full object-cover"
            playsInline
            loop
            muted={isMuted}
            preload="metadata"
          />
          
          <VideoControls
            isPlaying={isPlaying}
            isMuted={isMuted}
            onPlayPause={togglePlay}
            onMuteToggle={toggleMute}
          />
        </>
      )}
    </div>
  );
};
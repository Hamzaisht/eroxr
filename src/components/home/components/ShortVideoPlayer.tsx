
import { useState, useEffect, memo, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { MediaType } from "@/utils/media/types";
import { MediaRenderer } from "@/components/media/MediaRenderer";
import { reportMediaError } from "@/utils/media/mediaMonitoring";
import { mediaOrchestrator } from "@/utils/media/mediaOrchestrator";

interface ShortVideoPlayerProps {
  videoUrl: string | null;
  thumbnailUrl?: string;
  creatorId?: string;
  isCurrentVideo: boolean;
  isDeleting?: boolean;
  onError: () => void;
}

export const ShortVideoPlayer = memo(({ 
  videoUrl, 
  thumbnailUrl, 
  creatorId, 
  isCurrentVideo,
  isDeleting, 
  onError 
}: ShortVideoPlayerProps) => {
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const { toast } = useToast();
  
  // Create a stable media source object with multiple URL properties
  const mediaSource = useMemo(() => {
    if (!videoUrl) return null;
    
    return {
      video_url: videoUrl,
      url: videoUrl, // Add all possible URL properties 
      media_url: videoUrl,
      src: videoUrl,
      thumbnail_url: thumbnailUrl,
      creator_id: creatorId,
      media_type: MediaType.VIDEO
    };
  }, [videoUrl, thumbnailUrl, creatorId]);
  
  // Reset playing state when video URL changes
  useEffect(() => {
    setHasStartedPlaying(false);
  }, [videoUrl]);
  
  // Preload video when it's about to be played
  useEffect(() => {
    if (isCurrentVideo && mediaSource) {
      // Register this video with the orchestrator
      mediaOrchestrator.registerMediaRequest(mediaSource);
    }
  }, [isCurrentVideo, mediaSource]);
  
  // Handle video loading success
  const handleVideoLoad = useCallback(() => {
    setHasStartedPlaying(true);
  }, []);
  
  // Handle video error with improved error reporting
  const handleVideoError = useCallback(() => {
    console.error("Video error for short:", videoUrl);
    
    if (videoUrl) {
      try {
        reportMediaError(
          videoUrl,
          'load_failure',
          0,
          'video',
          'ShortVideoPlayer'
        );
      } catch (error) {
        console.error("Error reporting media error:", error);
      }
    }
    
    // Show a toast for user feedback
    toast({
      title: "Video loading error",
      description: "Unable to load this video. You may want to try again later.",
      variant: "destructive"
    });
    
    // Notify parent component
    onError();
  }, [videoUrl, toast, onError]);

  if (isDeleting) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-luxury-darker/80">
        <p className="text-luxury-neutral">Deleting video...</p>
      </div>
    );
  }
  
  if (!videoUrl || !mediaSource) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-luxury-darker/80">
        <p className="text-luxury-neutral">Video unavailable</p>
      </div>
    );
  }
  
  return (
    <MediaRenderer
      src={mediaSource}
      type={MediaType.VIDEO}
      fallbackSrc={thumbnailUrl} 
      className="h-full w-full object-cover"
      autoPlay={isCurrentVideo}
      onError={handleVideoError}
      onLoad={handleVideoLoad}
      controls={false}
      loop={true}
      muted={false}
      maxRetries={1}
    />
  );
});

ShortVideoPlayer.displayName = "ShortVideoPlayer";

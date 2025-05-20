
import { useState, useEffect, memo, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { MediaType } from "@/utils/media/types";
import { UniversalMedia } from "@/components/media/UniversalMedia";

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
  
  // Reset playing state when video URL changes
  useEffect(() => {
    setHasStartedPlaying(false);
  }, [videoUrl]);
  
  // Handle video loading success
  const handleVideoLoad = useCallback(() => {
    setHasStartedPlaying(true);
  }, []);
  
  // Handle video error with improved error reporting
  const handleVideoError = useCallback(() => {
    console.error("Video error for short:", videoUrl);
    
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
  
  if (!videoUrl) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-luxury-darker/80">
        <p className="text-luxury-neutral">Video unavailable</p>
      </div>
    );
  }
  
  return (
    <UniversalMedia
      item={{
        url: videoUrl,
        type: MediaType.VIDEO,
        thumbnail: thumbnailUrl,
        creator_id: creatorId
      }}
      className="h-full w-full object-cover"
      autoPlay={isCurrentVideo}
      onError={handleVideoError}
      onLoad={handleVideoLoad}
      controls={false}
      loop={true}
      muted={false}
    />
  );
});

ShortVideoPlayer.displayName = "ShortVideoPlayer";

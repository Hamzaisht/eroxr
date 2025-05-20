
import { useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { UniversalMedia } from "@/components/media/UniversalMedia";
import { MediaType } from "@/utils/media/types";

interface VideoControlsProps {
  videoUrl: string | null;
  avatarUrl: string | null;
  isActive: boolean;
}

export const VideoControls = ({ videoUrl, avatarUrl, isActive }: VideoControlsProps) => {
  const { toast } = useToast();
  
  console.log("VideoControls props:", { videoUrl, avatarUrl, isActive });

  const mediaItem = {
    url: videoUrl || avatarUrl || '',
    type: MediaType.VIDEO,
    poster: avatarUrl || undefined,
    // Include these properties for backward compatibility
    media_url: avatarUrl || '',
    video_url: videoUrl || '',
  };
  
  console.log("VideoControls media item:", mediaItem);

  const handleError = () => {
    console.error("VideoControls error:", videoUrl);
    toast({
      title: "Video Error",
      description: "Failed to play video content. Please try again.",
      variant: "destructive",
    });
  };

  return (
    <div className="absolute inset-0 w-full h-full">
      {videoUrl ? (
        <UniversalMedia
          item={mediaItem}
          className="h-full w-full object-cover"
          autoPlay={isActive}
          controls={false}
          onError={handleError}
        />
      ) : (
        <div className="h-full w-full bg-luxury-darker/50 backdrop-blur-xl flex items-center justify-center">
          <p className="text-luxury-neutral">No video available</p>
        </div>
      )}
    </div>
  );
};

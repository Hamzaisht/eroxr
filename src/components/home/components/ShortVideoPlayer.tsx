
import { useState, useEffect, memo } from "react";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Play } from "lucide-react";

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
  const { toast } = useToast();
  
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
    <div className="h-full w-full flex items-center justify-center bg-black">
      <div className="text-center">
        <Play className="w-16 h-16 text-white/60 mx-auto mb-4" />
        <p className="text-white/80">Video player coming soon</p>
      </div>
    </div>
  );
});

ShortVideoPlayer.displayName = "ShortVideoPlayer";


import { AlertCircle, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErosVideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  isActive: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  onError?: () => void;
  onVideoEnd?: () => void;
}

export function ErosVideoPlayer({
  videoUrl,
  thumbnailUrl,
  isActive,
  autoPlay = true,
  loop = true,
  muted = true,
  className = "",
  onError,
  onVideoEnd
}: ErosVideoPlayerProps) {
  if (!videoUrl) {
    return (
      <div className={cn("relative w-full h-full flex items-center justify-center bg-black/50", className)}>
        <p className="text-gray-300">Video unavailable</p>
      </div>
    );
  }
  
  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-center">
          <Play className="w-16 h-16 text-white/60 mx-auto mb-4" />
          <p className="text-white/80">Video player coming soon</p>
        </div>
      </div>
    </div>
  );
}

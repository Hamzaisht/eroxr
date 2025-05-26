
import { AlertCircle } from "lucide-react";

interface VideoThumbnailProps {
  videoUrl?: string;
  isHovered: boolean;
  isMobile: boolean;
  className?: string;
}

export const VideoThumbnail = ({ videoUrl, isHovered, isMobile, className = "" }: VideoThumbnailProps) => {
  return (
    <div className={`w-full h-full flex items-center justify-center bg-luxury-darker ${className}`}>
      <div className="text-center">
        <AlertCircle className="w-8 h-8 text-luxury-neutral mx-auto mb-2" />
        <p className="text-luxury-neutral text-sm">Video coming soon</p>
      </div>
    </div>
  );
};

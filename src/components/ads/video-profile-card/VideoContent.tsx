
import { useRef, useEffect } from 'react';
import { Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DatingAd } from '../types/dating';

interface VideoContentProps {
  ad: DatingAd;
  isActive: boolean;
  isHovered: boolean;
}

export const VideoContent = ({ ad, isActive, isHovered }: VideoContentProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Auto-play video when card becomes active or hovered
  useEffect(() => {
    if (videoRef.current) {
      if (isActive || isHovered) {
        // On hover or active, always play but muted
        videoRef.current.muted = true;
        videoRef.current.play().catch(e => console.error("Autoplay failed:", e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive, isHovered]);

  return (
    <div className="relative aspect-video w-full h-[60vh] overflow-hidden bg-black">
      {ad.video_url ? (
        <video
          ref={videoRef}
          src={ad.video_url}
          className={cn(
            "w-full h-full object-cover transition-all duration-500",
            isActive || isHovered ? "opacity-100" : "opacity-90 scale-[1.01]"
          )}
          loop
          muted={true}
          playsInline
          autoPlay={isHovered || isActive}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-luxury-darker/50">
          <Video className="w-16 h-16 text-luxury-neutral/30" />
        </div>
      )}
    </div>
  );
};

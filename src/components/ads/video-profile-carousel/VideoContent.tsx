
import { useRef, useEffect } from "react";
import { DatingAd } from "../types/dating";
import { Play } from "lucide-react";

interface VideoContentProps {
  ad: DatingAd;
  isActive: boolean;
  isHovered: boolean;
  isAnimation?: boolean;
}

export const VideoContent = ({ ad, isActive, isHovered, isAnimation }: VideoContentProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (videoRef.current) {
      if (isActive || isHovered) {
        videoRef.current.play().catch(err => {
          console.log("Video play error:", err);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive, isHovered]);
  
  return (
    <div className="w-full aspect-video bg-gray-900 relative">
      {ad.videoUrl || ad.video_url ? (
        <video 
          ref={videoRef}
          src={ad.videoUrl || ad.video_url}
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
          poster={ad.avatarUrl || ad.avatar_url}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-luxury-primary/10">
          <img 
            src={ad.avatarUrl || ad.avatar_url} 
            alt={ad.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {(!isActive && !isHovered) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="bg-white/20 rounded-full p-3 backdrop-blur-sm">
            <Play className="h-8 w-8 text-white" />
          </div>
        </div>
      )}
    </div>
  );
};

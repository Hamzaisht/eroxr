
import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface VideoContentProps {
  videoUrl: string;
  avatarUrl: string;
  isPlaying: boolean;
}

export const VideoContent = ({ videoUrl, avatarUrl, isPlaying }: VideoContentProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.play().catch(err => {
        console.error('Video playback error:', err);
      });
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isPlaying]);

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/80">
      {videoUrl && (
        <video 
          ref={videoRef}
          src={videoUrl} 
          className="w-full h-full object-cover" 
          loop 
          muted 
          playsInline
        />
      )}
      
      <div className="absolute top-4 left-4">
        <Avatar className="h-10 w-10 border-2 border-luxury-primary">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="bg-luxury-primary/20 text-luxury-primary text-xl">
            P
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};


import { useState, useRef, useEffect } from 'react';
import { Video, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DatingAd } from '../types/dating';
import { VideoControls } from './VideoControls';

interface VideoContentProps {
  ad: DatingAd;
  isActive: boolean;
  isHovered: boolean;
}

export const VideoContent = ({ ad, isActive, isHovered }: VideoContentProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Auto-play video when card becomes active
  useEffect(() => {
    if (isActive && videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(e => console.error("Autoplay failed:", e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive, isPlaying]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(e => console.error("Play failed:", e));
    }
    
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative aspect-video w-full h-[60vh] overflow-hidden bg-black">
      {ad.video_url ? (
        <video
          ref={videoRef}
          src={ad.video_url}
          className={cn(
            "w-full h-full object-cover transition-all duration-500",
            isPlaying ? "opacity-100" : "opacity-90 scale-[1.01]"
          )}
          loop
          muted={isMuted}
          playsInline
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-luxury-darker/50">
          <Video className="w-16 h-16 text-luxury-neutral/30" />
        </div>
      )}
      
      {/* Video controls */}
      <VideoControls 
        isHovered={isHovered} 
        isPlaying={isPlaying} 
        isMuted={isMuted}
        togglePlay={togglePlay}
        toggleMute={toggleMute}
      />
    </div>
  );
};


import { useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface VideoControlsProps {
  videoUrl: string | null;
  avatarUrl: string | null;
  isActive: boolean;
}

export const VideoControls = ({ videoUrl, avatarUrl, isActive }: VideoControlsProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load(); // Force reload the video
      
      if (isActive) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Video playback error:', error);
            toast({
              title: "Video Error",
              description: "Failed to play video content. Please try again.",
              variant: "destructive",
            });
          });
        }
      } else {
        videoRef.current.pause();
        if (videoRef.current.currentTime > 0) {
          videoRef.current.currentTime = 0;
        }
      }
    }
  }, [isActive, videoUrl, toast]);

  return (
    <div className="absolute inset-0 w-full h-full">
      {videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          className="h-full w-full object-cover"
          loop
          muted
          playsInline
          preload="auto"
          poster={avatarUrl || undefined}
          onError={(e) => {
            console.error('Video loading error:', e);
            toast({
              title: "Error",
              description: "Failed to load video content. Please try again.",
              variant: "destructive",
            });
          }}
        />
      ) : (
        <div className="h-full w-full bg-luxury-dark/50 backdrop-blur-xl flex items-center justify-center">
          <p className="text-luxury-neutral">No video available</p>
        </div>
      )}
    </div>
  );
};

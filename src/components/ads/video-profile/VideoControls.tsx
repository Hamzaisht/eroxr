import { useRef, useEffect } from 'react';

interface VideoControlsProps {
  videoUrl: string | null;
  avatarUrl: string | null;
  isActive: boolean;
}

export const VideoControls = ({ videoUrl, avatarUrl, isActive }: VideoControlsProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(console.error);
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive]);

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
          autoPlay={isActive}
          poster={avatarUrl || undefined}
        />
      ) : (
        <div className="h-full w-full bg-luxury-dark/50 backdrop-blur-xl flex items-center justify-center">
          <p className="text-luxury-neutral">No video available</p>
        </div>
      )}
    </div>
  );
};
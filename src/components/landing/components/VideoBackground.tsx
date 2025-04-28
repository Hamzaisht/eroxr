
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useMediaQuery } from "@/hooks/use-mobile";

export const VideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    // Optimize video loading
    video.preload = "auto";
    video.load();
  }, []);
  
  // Show static gradient for users who prefer reduced motion or on mobile
  if (prefersReducedMotion || isMobile) {
    return (
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-luxury-dark via-luxury-darker to-luxury-dark opacity-90" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/50 z-10" />
      
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>
    </div>
  );
};

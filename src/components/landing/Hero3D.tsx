
import { useScroll, useTransform, motion, useMotionValueEvent } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useRef, useMemo, memo } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { HeroNavigation } from "./components/HeroNavigation";
import { HeroContent } from "./components/HeroContent";
import { ParticleBackground } from "./components/ParticleBackground";

interface Hero3DProps {
  isActive?: boolean;
}

export const Hero3D = memo(({ isActive = true }: Hero3DProps) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const { scrollY } = useScroll();
  const headerBg = useTransform(
    scrollY,
    [0, 100],
    ["rgba(13, 17, 23, 0)", "rgba(13, 17, 23, 1)"]
  );
  const videoOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  const contentScale = useTransform(scrollY, [0, 200], [1, 0.95]);
  const contentOpacity = useTransform(scrollY, [0, 300], [1, 0.8]);
  const session = useSession();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Optimize scroll event listener with useMotionValueEvent
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!isActive) return;
    // Performance optimization - no DOM updates in scroll handler
    // Just track if we need to animate something based on scroll
  });

  useEffect(() => {
    if (session) {
      navigate('/home');
    }
  }, [session, navigate]);

  // Memoize video loading to prevent unnecessary re-renders
  useEffect(() => {
    if (!isActive) return;

    const loadVideo = async () => {
      try {
        const { data: { publicUrl } } = supabase
          .storage
          .from('landing-videos')
          .getPublicUrl('background.mp4');
        
        if (publicUrl) {
          setVideoUrl(publicUrl);
        }
      } catch (error) {
        console.error("Error loading video:", error);
      }
    };

    loadVideo();
  }, [isActive]);

  // Handle video playback
  useEffect(() => {
    if (!isActive || !videoRef.current) return;

    // Add event listener for user interaction to enable autoplay
    const handleUserInteraction = () => {
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current.play().catch(err => console.error("Video playback failed:", err));
      }
    };

    const handleVideoLoaded = () => {
      setVideoLoaded(true);
    };

    if (videoRef.current) {
      videoRef.current.addEventListener('loadeddata', handleVideoLoaded);
    }

    window.addEventListener("click", handleUserInteraction);
    window.addEventListener("touchstart", handleUserInteraction);

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadeddata', handleVideoLoaded);
      }
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
    };
  }, [isActive, videoRef.current]);

  // Only render particles when section is active
  const particles = useMemo(() => {
    return isActive ? <ParticleBackground /> : null;
  }, [isActive]);

  return (
    <div className="relative w-full min-h-screen flex flex-col overflow-hidden">
      {/* Background Video - Edge to Edge */}
      {videoUrl && (
        <motion.div 
          className="absolute inset-0 w-full h-full z-[-1] overflow-hidden"
          style={{ opacity: videoOpacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: videoLoaded ? 1 : 0 }}
          transition={{ duration: 1.5 }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            loop
            className="absolute h-full w-full object-cover object-center"
            style={{ opacity: videoLoaded ? 1 : 0 }}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-dark/40 to-luxury-darker/60" />
        </motion.div>
      )}
      
      {/* Optimized particle background - only render when active */}
      {particles}
      
      {/* Navigation */}
      <HeroNavigation headerBg={headerBg} />
      
      {/* Content */}
      <motion.div 
        className="flex-1 flex items-center w-full px-0"
        style={{
          scale: contentScale,
          opacity: contentOpacity,
        }}
      >
        <motion.div 
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <HeroContent />
        </motion.div>
      </motion.div>
    </div>
  );
});

Hero3D.displayName = "Hero3D";


import { useScroll, useTransform, motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { HeroNavigation } from "./components/HeroNavigation";
import { HeroContent } from "./components/HeroContent";
import { FloatingElements } from "./components/FloatingElements";
import { ParticleBackground } from "./components/ParticleBackground";
import { CustomCursor } from "./components/CustomCursor";

export const Hero3D = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
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

  useEffect(() => {
    if (session) {
      navigate('/home');
    }
  }, [session, navigate]);

  useEffect(() => {
    const loadVideo = async () => {
      const { data: { publicUrl } } = supabase
        .storage
        .from('landing-videos')
        .getPublicUrl('background.mp4');
      
      if (publicUrl) {
        setVideoUrl(publicUrl);
      }
    };

    loadVideo();

    // Add event listener for user interaction to enable autoplay
    const handleUserInteraction = () => {
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current.play().catch(err => console.error("Video playback failed:", err));
      }
    };

    window.addEventListener("click", handleUserInteraction);
    window.addEventListener("touchstart", handleUserInteraction);

    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen flex flex-col">
      {/* Custom Cursor */}
      <CustomCursor />
      
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Hero Background */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{
          backgroundImage: 'linear-gradient(to bottom, rgba(13, 17, 23, 0.5), rgba(22, 27, 34, 0.6))'
        }} 
      />
      
      {/* Background Video */}
      {videoUrl && (
        <motion.div 
          className="absolute inset-0 w-full h-full z-[-1]"
          style={{ opacity: videoOpacity }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            loop
            className="w-full h-full object-cover"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        </motion.div>
      )}
      
      {/* Floating design elements */}
      <FloatingElements />
      
      {/* Navigation */}
      <HeroNavigation headerBg={headerBg} />
      
      {/* Content */}
      <motion.div 
        className="flex-1 flex items-center justify-center w-full max-w-[1440px] mx-auto"
        style={{
          scale: contentScale,
          opacity: contentOpacity,
        }}
      >
        <motion.div 
          className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-between px-6 xl:px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <HeroContent />
        </motion.div>
      </motion.div>
    </div>
  );
};

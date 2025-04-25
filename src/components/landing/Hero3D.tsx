
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Hero3DProps {
  isActive?: boolean;
}

export const Hero3D = ({ isActive = true }: Hero3DProps) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const session = useSession();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (session) {
      navigate('/home');
    }
  }, [session, navigate]);

  useEffect(() => {
    if (!isActive) return;

    // Direct video URL to avoid potential CORS issues
    const directVideoUrl = "https://cdn.coverr.co/videos/coverr-typing-on-laptop-keyboard-3634/1080p.mp4";
    
    setVideoUrl(directVideoUrl);
    setLoadError(false);
  }, [isActive]);

  useEffect(() => {
    if (!isActive || !videoRef.current) return;

    const video = videoRef.current;

    const handleVideoLoaded = () => {
      console.log("Video loaded successfully");
      setVideoLoaded(true);
      setLoadError(false);
    };

    const handleVideoError = (e: Event) => {
      console.error("Video loading error:", e);
      setLoadError(true);
      setVideoLoaded(false);
      
      toast({
        title: "Video loading error",
        description: "Background video couldn't be loaded. Using fallback background.",
        variant: "destructive",
      });
    };

    video.addEventListener('loadeddata', handleVideoLoaded);
    video.addEventListener('error', handleVideoError);

    return () => {
      video.removeEventListener('loadeddata', handleVideoLoaded);
      video.removeEventListener('error', handleVideoError);
    };
  }, [isActive, videoUrl, toast]);

  return (
    <div className="absolute inset-0 w-screen h-screen overflow-hidden z-0">
      {/* Fallback background gradient when video fails to load */}
      <div className={`absolute inset-0 bg-gradient-to-b from-luxury-dark via-luxury-darker to-luxury-dark transition-opacity duration-1000 ${loadError ? 'opacity-100' : 'opacity-0'}`}></div>
      
      {videoUrl && (
        <motion.div 
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: videoLoaded && !loadError ? 1 : 0 }}
          transition={{ duration: 1.5 }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            loop
            className="absolute h-full w-full object-cover"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-dark/60 to-luxury-darker/80" />
        </motion.div>
      )}
      
      {/* Gradient overlay - full width and height */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-luxury-dark/50 to-luxury-dark" />
    </div>
  );
};

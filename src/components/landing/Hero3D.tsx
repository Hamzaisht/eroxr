
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";

interface Hero3DProps {
  isActive?: boolean;
}

export const Hero3D = ({ isActive = true }: Hero3DProps) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const session = useSession();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (session) {
      navigate('/home');
    }
  }, [session, navigate]);

  useEffect(() => {
    if (!isActive) return;

    const loadVideo = async () => {
      try {
        setVideoUrl('https://player.vimeo.com/external/503631518.hd.mp4?s=73f65bff02bf8622e1af5d85b2327fcdd074ec94&profile_id=175&oauth2_token_id=57447761');
      } catch (error) {
        console.error("Error loading video:", error);
      }
    };

    loadVideo();
  }, [isActive]);

  useEffect(() => {
    if (!isActive || !videoRef.current) return;

    const handleVideoLoaded = () => {
      setVideoLoaded(true);
    };

    if (videoRef.current) {
      videoRef.current.addEventListener('loadeddata', handleVideoLoaded);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadeddata', handleVideoLoaded);
      }
    };
  }, [isActive, videoRef.current]);

  return (
    <div className="absolute inset-0 w-screen h-screen overflow-hidden z-0">
      {videoUrl && (
        <motion.div 
          className="absolute inset-0 w-full h-full"
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
            className="absolute h-full w-full object-cover"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-dark/40 to-luxury-darker/60" />
        </motion.div>
      )}
      
      {/* Gradient overlay - full width and height */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-luxury-dark/50 to-luxury-dark" />
    </div>
  );
};

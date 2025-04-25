
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Hero3DProps {
  isActive?: boolean;
}

export const Hero3D = ({ isActive = true }: Hero3DProps) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

    // Using a more reliable self-hosted video URL
    const directVideoUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";
    
    setVideoUrl(directVideoUrl);
    setLoadError(false);
    setIsLoading(true);
    
    console.log("Attempting to load video:", directVideoUrl);
  }, [isActive]);

  useEffect(() => {
    if (!isActive || !videoRef.current) return;

    const video = videoRef.current;

    const handleVideoLoaded = () => {
      console.log("Video loaded successfully");
      setVideoLoaded(true);
      setLoadError(false);
      setIsLoading(false);
    };

    const handleVideoError = (e: Event) => {
      console.error("Video loading error:", e);
      setLoadError(true);
      setVideoLoaded(false);
      setIsLoading(false);
      
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
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
      {/* Fallback background gradient when video fails to load */}
      <div className={`absolute inset-0 bg-gradient-to-b from-luxury-dark via-luxury-darker to-luxury-dark transition-opacity duration-1000 ${loadError ? 'opacity-100' : 'opacity-0'}`}></div>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-luxury-dark/50">
          <Loader2 className="w-8 h-8 text-luxury-primary animate-spin" />
        </div>
      )}
      
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
          {/* Reduced opacity gradients for better video visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-dark/40 to-luxury-darker/60" />
        </motion.div>
      )}
      
      {/* Lighter radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-luxury-dark/30 to-luxury-dark/50" />
    </div>
  );
};

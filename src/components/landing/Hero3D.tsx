
import { useScroll, useTransform } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { HeroNavigation } from "./components/HeroNavigation";
import { HeroContent } from "./components/HeroContent";

export const Hero3D = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const { scrollY } = useScroll();
  const headerBg = useTransform(
    scrollY,
    [0, 100],
    ["rgba(13, 17, 23, 0)", "rgba(13, 17, 23, 1)"]
  );
  const session = useSession();
  const navigate = useNavigate();

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
  }, []);

  return (
    <div className="relative w-full min-h-screen flex flex-col">
      {/* Hero Background */}
      <div className="absolute inset-0 bg-cover bg-center z-0" style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(13, 17, 23, 0.8), rgba(22, 27, 34, 0.9))'
      }} />
      
      {/* Background Video */}
      {videoUrl && (
        <div className="absolute inset-0 w-full h-full z-[-1]">
          <video
            autoPlay
            playsInline
            muted
            loop
            className="w-full h-full object-cover"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>
      )}
      
      <HeroNavigation headerBg={headerBg} />
      
      <div className="flex-1 flex items-center justify-start px-6 xl:px-8">
        <HeroContent />
      </div>
    </div>
  );
};

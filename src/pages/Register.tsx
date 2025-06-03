
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { SignupForm } from "@/components/auth/SignupForm";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { BackgroundVideo } from "@/components/video/BackgroundVideo";
import { BackgroundEffects } from "@/components/layout/BackgroundEffects";

const Register = () => {
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("Register page rendered with session:", session ? "exists" : "null");
    
    if (session) {
      const from = location.state?.from || "/home";
      console.log("User is logged in, redirecting to:", from);
      navigate(from, { replace: true });
    }
  }, [session, navigate, location]);

  if (session === undefined) {
    return <LoadingScreen />;
  }

  const handleToggleMode = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-luxury-dark flex items-center justify-center overflow-auto">
      <BackgroundVideo 
        videoUrl="/background-video.mp4"
        fallbackImage="/bg-fallback.jpg"
        overlayOpacity={60}
      />
      
      <div className="fixed inset-0 pointer-events-none">
        <BackgroundEffects />
      </div>
      
      <div className="relative z-10 w-full px-4 sm:px-8 md:px-12 lg:px-24">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md mx-auto"
          >
            <SignupForm onToggleMode={handleToggleMode} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Register;

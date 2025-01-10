import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { InteractiveNav } from "./InteractiveNav";

export const MainLayout = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      if (!session) {
        navigate('/login', { replace: true });
        return;
      }
      setIsInitialized(true);
    };

    checkSession();
  }, [session, navigate]);

  if (!isInitialized || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-luxury-dark">
        <div className="w-8 h-8 border-4 border-luxury-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-luxury-gradient-from via-luxury-gradient-via to-luxury-gradient-to">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-luxury-primary/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-luxury-accent/20 blur-3xl animate-pulse" />
      </div>
      
      {/* Interactive Side Navigation */}
      <InteractiveNav />
      
      {/* Main Content */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative min-h-screen pl-20 w-full"
      >
        <div className="min-h-screen w-full backdrop-blur-sm px-4 py-6">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
};
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

interface MainLayoutProps {
  children?: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!session) {
      navigate('/login');
      return;
    }
    
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [session, navigate]);

  if (!isInitialized || !session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-luxury-dark">
      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto p-4 pt-16 lg:pt-4 min-h-screen">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};
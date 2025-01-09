import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react"; // Add this import

interface MainLayoutProps {
  children?: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const isMobile = useIsMobile();
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
    <div className="flex min-h-screen bg-luxury-dark">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-luxury-dark/80 backdrop-blur-lg text-luxury-neutral hover:text-luxury-primary transition-colors lg:hidden"
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {(isMobileMenuOpen || !isMobile) && (
          <>
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed inset-y-0 left-0 z-40 w-64 lg:w-72"
            >
              <AppSidebar onClose={() => setIsMobileMenuOpen(false)} />
            </motion.div>
            
            {/* Mobile Overlay */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${
        isMobileMenuOpen ? 'lg:ml-72' : 'ml-0'
      }`}>
        <div className="container mx-auto p-4 pt-16 lg:pt-4 min-h-screen">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};
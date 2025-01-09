import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSession } from "@supabase/auth-helpers-react";

export const MainLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const isMobile = useIsMobile();
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate('/login');
      return;
    }
    
    // Delay initialization to prevent flash of content
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [session, navigate]);

  if (!isInitialized) {
    return null; // Return null during initialization to prevent flash
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Backdrop for mobile */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 transform 
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <AppSidebar onClose={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto w-full">
        {isMobile && (
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="fixed top-4 left-4 z-30 p-2 hover:bg-accent rounded-lg"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        <div className="container mx-auto p-4 pt-16 lg:pt-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
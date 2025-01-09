import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSession } from "@supabase/auth-helpers-react";

interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
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
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AppSidebar onClose={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-luxury-dark">
        {isMobile && (
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="fixed top-4 left-4 z-30 rounded-lg bg-luxury-dark p-2 text-white"
          >
            <Menu className="h-6 w-6" />
          </button>
        )}
        <div className="container mx-auto p-4 pt-16 lg:pt-4">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};
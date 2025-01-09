import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

export const MainLayout = () => {
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
    
    // Show welcome toast on successful login
    toast({
      title: "Welcome back!",
      description: "You have successfully signed in.",
    });
    
    // Delay initialization to prevent flash of content
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [session, navigate, toast]);

  if (!isInitialized || !session) {
    return null;
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
          <Outlet />
        </div>
      </main>
    </div>
  );
};
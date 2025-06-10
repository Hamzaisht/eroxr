
import { useLocation, Outlet, Navigate } from "react-router-dom";
import { BackgroundEffects } from "./BackgroundEffects";
import { InteractiveNav } from "./InteractiveNav";
import { MainContent } from "./components/MainContent";
import { FloatingActionMenu } from "./FloatingActionMenu";
import { MainNav } from "@/components/MainNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { LoadingScreen } from "./LoadingScreen";
import { useAuth } from "@/contexts/AuthContext";

export const MainLayout = () => {
  const { user, session, loading } = useAuth();
  const location = useLocation();
  const isErosRoute = location.pathname.includes('/shorts');
  const isMobile = useIsMobile();
  
  console.log("MainLayout - Current path:", location.pathname);
  console.log("MainLayout - Auth state:", { 
    user: user ? "exists" : "null", 
    session: session ? "exists" : "null",
    loading 
  });
  
  // Show loading screen while checking authentication
  if (loading) {
    console.log("MainLayout - Showing loading screen (checking auth)");
    return <LoadingScreen />;
  }
  
  // Redirect to login if not authenticated
  if (!session || !user) {
    console.log("MainLayout - No session/user, redirecting to login");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  console.log("MainLayout - Rendering authenticated layout");

  return (
    <div className="flex min-h-screen w-full bg-luxury-gradient-from overflow-x-hidden">
      <InteractiveNav />
      
      <div className="flex-1 min-h-screen relative w-full">
        {/* Background with geex art studio aesthetic */}
        <div className="fixed inset-0 pointer-events-none">
          <BackgroundEffects />
          {/* Additional studio-inspired background elements */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_80%)] opacity-5" />
          <div className="absolute inset-0 bg-gradient-to-br from-luxury-dark via-luxury-darker to-luxury-gradient-to opacity-90" />
        </div>
        
        {/* Main Navigation Header */}
        <MainNav />
        
        {/* Main content wrapper with studio styling */}
        <MainContent isErosRoute={isErosRoute}>
          <div className="pt-20 relative z-10"> {/* Add padding for fixed header and ensure content is above background */}
            <Outlet />
          </div>
        </MainContent>

        {/* Floating action menu */}
        <FloatingActionMenu currentPath={location.pathname} />
      </div>
    </div>
  );
};

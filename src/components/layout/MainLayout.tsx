
import { useLocation, Outlet, Navigate } from "react-router-dom";
import { BackgroundEffects } from "./BackgroundEffects";
import { InteractiveNav } from "./InteractiveNav";
import { CollapsibleNav } from "./CollapsibleNav";
import { MainContent } from "./components/MainContent";
import { FloatingActionMenu } from "./FloatingActionMenu";
import { MainNav } from "@/components/MainNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { LoadingScreen } from "./LoadingScreen";
import { useAuth } from "@/contexts/AuthContext";
import { ErrorState } from "@/components/ui/ErrorState";
import { UploadFloatingButton } from "@/components/upload/UploadFloatingButton";

export const MainLayout = () => {
  const { user, session, loading, error, clearError } = useAuth();
  const location = useLocation();
  const isErosRoute = location.pathname.includes('/shorts');
  const isMobile = useIsMobile();
  
  console.log("🏗️ MainLayout - Current state:", { 
    pathname: location.pathname,
    user: user ? "exists" : "null", 
    session: session ? "exists" : "null",
    loading,
    error: error || "none"
  });
  
  // Show loading screen while checking authentication
  if (loading) {
    console.log("🏗️ MainLayout - Showing loading screen");
    return <LoadingScreen />;
  }
  
  // Show error state if there's an authentication error
  if (error) {
    console.log("🏗️ MainLayout - Showing error state:", error);
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <ErrorState 
          title="Authentication Error"
          description={error}
          onRetry={clearError}
        />
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!session || !user) {
    console.log("🏗️ MainLayout - No session/user, redirecting to /login");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  console.log("🏗️ MainLayout - Rendering authenticated layout");

  return (
    <div className="flex min-h-screen w-full bg-luxury-gradient-from overflow-x-hidden">
      {/* Use collapsible nav for Eros/Shorts route for immersive experience */}
      {isErosRoute ? <CollapsibleNav /> : <InteractiveNav />}
      
      <div className={`flex-1 min-h-screen relative w-full ${isErosRoute ? '' : 'md:ml-20'}`}>
        {/* Background with geex art studio aesthetic */}
        <div className="fixed inset-0 pointer-events-none">
          <BackgroundEffects />
          {/* Additional studio-inspired background elements */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_80%)] opacity-5" />
          <div className="absolute inset-0 bg-gradient-to-br from-luxury-dark via-luxury-darker to-luxury-gradient-to opacity-90" />
        </div>
        
        {/* Main Navigation Header - hide on Eros route */}
        {!isErosRoute && <MainNav />}
        
        {/* Main content wrapper with studio styling */}
        <MainContent isErosRoute={isErosRoute}>
          <div className={`relative z-10 ${isErosRoute ? '' : 'pt-20'}`}>
            <Outlet />
          </div>
        </MainContent>

        {/* Floating action menu - hide on Eros route */}
        {!isErosRoute && <FloatingActionMenu currentPath={location.pathname} />}
        
        {/* Upload floating button - available everywhere */}
        <UploadFloatingButton />
      </div>
    </div>
  );
};

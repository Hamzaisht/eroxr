
import { useSession } from "@supabase/auth-helpers-react";
import { useLocation, Outlet, Navigate } from "react-router-dom";
import { BackgroundEffects } from "./BackgroundEffects";
import { InteractiveNav } from "./InteractiveNav";
import { MainContent } from "./components/MainContent";
import { FloatingActionMenu } from "./FloatingActionMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { LoadingScreen } from "./LoadingScreen";
import { useEffect, useState } from "react";

export const MainLayout = () => {
  const session = useSession();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const isErosRoute = location.pathname.includes('/shorts');
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Give session time to load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  console.log("MainLayout - session:", session ? "exists" : "null");
  
  // Show loading screen while session is being determined
  if (isLoading && session === undefined) {
    return <LoadingScreen />;
  }
  
  // Redirect to login if not authenticated
  if (!session) {
    console.log("No session in MainLayout, redirecting to login");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return (
    <div className="flex min-h-screen w-full bg-[#0D1117] overflow-x-hidden">
      <InteractiveNav />
      
      <div className="flex-1 min-h-screen relative w-full">
        {/* Background */}
        <div className="fixed inset-0 pointer-events-none">
          <BackgroundEffects />
        </div>
        
        {/* Main content wrapper */}
        <MainContent isErosRoute={isErosRoute}>
          <Outlet />
        </MainContent>

        {/* Single source for all upload buttons */}
        <FloatingActionMenu currentPath={location.pathname} />
      </div>
    </div>
  );
};

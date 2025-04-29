
import { useSession } from "@supabase/auth-helpers-react";
import { useLocation, Outlet, Navigate } from "react-router-dom";
import { BackgroundEffects } from "./BackgroundEffects";
import { InteractiveNav } from "./InteractiveNav";
import { MainContent } from "./components/MainContent";
import { FloatingActionMenu } from "./FloatingActionMenu";
import { useMediaQuery } from "@/hooks/use-mobile";
import { LoadingScreen } from "./LoadingScreen";

export const MainLayout = () => {
  const session = useSession();
  const location = useLocation();
  const isErosRoute = location.pathname.includes('/shorts');
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  console.log("MainLayout - session:", session ? "exists" : "null"); // Debug logging
  
  // Show loading screen while session is being determined
  if (session === undefined) {
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

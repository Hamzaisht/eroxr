
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { GodmodeSidebar } from "./GodmodeSidebar";
import { BackgroundEffects } from "@/components/layout/BackgroundEffects";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { useGhostMode } from "@/hooks/useGhostMode";
import { SurveillanceProvider } from "@/components/admin/platform/surveillance/SurveillanceContext";
import { LiveSession } from "@/components/admin/platform/surveillance/types";

function GodmodeLayout() {
  const session = useSession();
  const location = useLocation();
  const { isSuperAdmin, isLoading } = useSuperAdminCheck();
  const { liveAlerts, refreshAlerts, startSurveillance } = useGhostMode();
  
  // Add debug logging
  console.log("GodmodeLayout rendering, session:", session ? "exists" : "null");
  console.log("Is Super Admin:", isSuperAdmin);
  console.log("User email:", session?.user?.email);

  // Show loading while checking admin status
  if (isLoading) {
    return <LoadingScreen />;
  }

  // If no session, redirect to login
  if (!session) {
    console.log("No session, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role guard for super_admin
  if (!isSuperAdmin) {
    console.log("Access denied: User is not a super_admin");
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return (
    <SurveillanceProvider
      liveAlerts={liveAlerts}
      refreshAlerts={refreshAlerts}
      startSurveillance={startSurveillance as (session: LiveSession) => Promise<boolean>}
    >
      <div className="flex min-h-screen w-full bg-[#0D1117]">
        <GodmodeSidebar />
        
        <div className="flex-1 ml-[60px] md:ml-[250px] min-h-screen">
          {/* Background */}
          <div className="fixed inset-0 pointer-events-none">
            <BackgroundEffects />
          </div>
          
          {/* Main content wrapper */}
          <div className="relative z-10 p-4 md:p-6 h-full">
            <Outlet />
          </div>
        </div>
      </div>
    </SurveillanceProvider>
  );
}

export default GodmodeLayout;

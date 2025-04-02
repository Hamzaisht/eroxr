
import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { GodmodeSidebar } from "@/components/admin/godmode/GodmodeSidebar";
import { SurveillanceProvider } from "@/components/admin/platform/surveillance/SurveillanceContext";
import { useGhostMode } from "@/hooks/useGhostMode";

export default function GodmodeDashboard() {
  const session = useSession();
  const { isSuperAdmin, isLoading: isAdminCheckLoading } = useSuperAdminCheck();
  const { toast } = useToast();
  const { isGhostMode, liveAlerts, refreshAlerts, startSurveillance } = useGhostMode();

  const isLoading = isAdminCheckLoading;

  // Notify when admin enters godmode
  useEffect(() => {
    if (isSuperAdmin && !isLoading) {
      toast({
        title: isGhostMode ? "Ghost Mode Active" : "Godmode Active",
        description: isGhostMode 
          ? "You are browsing invisibly. Users cannot see your actions." 
          : "You have full administrative access.",
      });
    }
  }, [isSuperAdmin, isLoading, isGhostMode, toast]);

  // If no session, redirect to login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Show loading while checking admin status
  if (isLoading) {
    return <LoadingScreen />;
  }

  // If not a super admin, redirect to home
  if (!isSuperAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <SurveillanceProvider
      liveAlerts={liveAlerts}
      refreshAlerts={refreshAlerts}
      startSurveillance={startSurveillance}
    >
      <div className="flex h-screen bg-[#0D1117]">
        <GodmodeSidebar />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </SurveillanceProvider>
  );
}

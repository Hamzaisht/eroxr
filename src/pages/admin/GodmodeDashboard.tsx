
import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { GodmodeSidebar } from "@/components/admin/godmode/GodmodeSidebar";
import { SurveillanceProvider } from "@/components/admin/platform/surveillance/SurveillanceContext";
import { useGhostMode } from "@/hooks/useGhostMode";
import { LiveAlert, LiveSession } from "@/components/admin/platform/surveillance/types";

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

  // We need to convert the liveAlerts from the hook to the format expected by SurveillanceProvider
  const formattedAlerts: LiveAlert[] = liveAlerts.map(alert => ({
    id: alert.id,
    type: alert.type,
    user_id: alert.user_id,
    username: alert.username || 'Unknown',
    avatar_url: alert.avatar_url,
    timestamp: alert.created_at,
    created_at: alert.created_at,
    content_type: alert.content_type || 'unknown',
    reason: alert.reason || '',
    severity: alert.severity || 'medium',
    content_id: alert.content_id || '',
    priority: (alert.severity === 'high' ? 'high' : alert.severity === 'medium' ? 'medium' : 'low') as 'high' | 'medium' | 'low',
    message: alert.reason || 'Alert triggered',
    source: 'system',
    alert_type: alert.type,
    status: 'new',
    title: `${alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Alert`,
  }));

  return (
    <SurveillanceProvider
      liveAlerts={formattedAlerts}
      refreshAlerts={refreshAlerts}
      startSurveillance={startSurveillance as (session: LiveSession) => Promise<boolean>}
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

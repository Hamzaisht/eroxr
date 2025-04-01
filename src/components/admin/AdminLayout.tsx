
import { useSession } from "@supabase/auth-helpers-react";
import { Navigate, Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";
import { NotAuthorized } from "./NotAuthorized";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { useUserRole } from "@/hooks/useUserRole";
import { useGhostMode } from "@/hooks/useGhostMode";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export const AdminLayout = () => {
  const session = useSession();
  const { isSuperAdmin, isLoading: isAdminCheckLoading } = useSuperAdminCheck();
  const { data: userRole, isLoading: isRoleLoading } = useUserRole();
  const { isGhostMode } = useGhostMode();
  const { toast } = useToast();

  const isLoading = isAdminCheckLoading || isRoleLoading;

  // Notify when admin enters the admin panel
  useEffect(() => {
    if (isSuperAdmin && !isLoading) {
      toast({
        title: isGhostMode ? "Ghost Mode Active" : "Admin Mode Active",
        description: isGhostMode 
          ? "You are browsing invisibly. Users cannot see your actions." 
          : "Users can see your actions in this mode.",
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

  // If not a super admin, show unauthorized page
  if (!isSuperAdmin) {
    return <NotAuthorized />;
  }

  return (
    <div className="flex h-screen bg-[#0D1117]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

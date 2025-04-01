
import { useSession } from "@supabase/auth-helpers-react";
import { Navigate, Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";
import { NotAuthorized } from "./NotAuthorized";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { useUserRole } from "@/hooks/useUserRole";

export const AdminLayout = () => {
  const session = useSession();
  const { isSuperAdmin, isLoading: isAdminCheckLoading } = useSuperAdminCheck();
  const { data: userRole, isLoading: isRoleLoading } = useUserRole();

  const isLoading = isAdminCheckLoading || isRoleLoading;

  // If no session, redirect to login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Show loading while checking admin status
  if (isLoading) {
    return <LoadingScreen />;
  }

  // If not an admin or super admin, show unauthorized page
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


import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { GodmodeSidebar } from "./GodmodeSidebar";
import { BackgroundEffects } from "@/components/layout/BackgroundEffects";

function GodmodeLayout() {
  const session = useSession();
  const location = useLocation();
  const role = session?.user?.user_metadata?.role;
  
  // Add debug logging
  console.log("GodmodeLayout rendering, session:", session ? "exists" : "null");
  console.log("User role:", role || "not set");

  // Role guard for super_admin
  if (role !== "super_admin") {
    console.log("Access denied: User is not a super_admin");
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return (
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
  );
}

export default GodmodeLayout;

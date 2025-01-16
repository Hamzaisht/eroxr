import { useSession } from "@supabase/auth-helpers-react";
import { useLocation } from "react-router-dom";
import { BackgroundEffects } from "./BackgroundEffects";
import { InteractiveNav } from "./InteractiveNav";
import { MainContent } from "./components/MainContent";
import { FloatingActionMenu } from "./FloatingActionMenu";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  const session = useSession();
  const location = useLocation();
  const isErosRoute = location.pathname.includes('/shorts');

  if (!session) return null;

  return (
    <div className="flex min-h-screen bg-[#0D1117]">
      <InteractiveNav />
      
      <div className="flex-1 ml-[80px] md:ml-[240px] min-h-screen relative">
        {/* Background */}
        <div className="fixed inset-0 pointer-events-none">
          <BackgroundEffects />
        </div>
        
        {/* Main content wrapper */}
        <MainContent isErosRoute={isErosRoute}>
          <Outlet />
        </MainContent>

        <FloatingActionMenu currentPath={location.pathname} />
      </div>
    </div>
  );
};
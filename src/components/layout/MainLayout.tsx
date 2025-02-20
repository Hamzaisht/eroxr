
import { useSession } from "@supabase/auth-helpers-react";
import { useLocation, Outlet } from "react-router-dom";
import { BackgroundEffects } from "./BackgroundEffects";
import { InteractiveNav } from "./InteractiveNav";
import { MainContent } from "./components/MainContent";
import { FloatingActionMenu } from "./FloatingActionMenu";

export const MainLayout = () => {
  const session = useSession();
  const location = useLocation();
  const isErosRoute = location.pathname.includes('/shorts');

  if (!session) return null;

  return (
    <div className="flex min-h-screen w-full bg-[#0D1117]">
      <InteractiveNav />
      
      <div className="flex-1 ml-[60px] md:ml-[220px] min-h-screen">
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

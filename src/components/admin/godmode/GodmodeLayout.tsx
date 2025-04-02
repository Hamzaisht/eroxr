
import { Outlet } from "react-router-dom";
import { GodmodeSidebar } from "./GodmodeSidebar";
import { BackgroundEffects } from "@/components/layout/BackgroundEffects";

function GodmodeLayout() {
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

import { ReactNode } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";
import { BackgroundEffects } from "./BackgroundEffects";
import { InteractiveNav } from "./InteractiveNav";
import { MainContent } from "./components/MainContent";
import { UploadDialog } from "./UploadDialog";
import { FloatingActionMenu } from "./FloatingActionMenu";
import { supabase } from "@/integrations/supabase/client";

interface MainLayoutProps {
  children?: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const session = useSession();
  const { toast } = useToast();
  const location = useLocation();

  console.log("MainLayout rendering", { children, location }); // Debug log

  return (
    <div className="min-h-screen bg-[#0D1117] relative">
      <InteractiveNav />
      
      <div className="relative min-h-screen ml-[80px] md:ml-[240px]">
        {/* Background with pointer-events-none to ensure content is clickable */}
        <div className="fixed inset-0 pointer-events-none">
          <BackgroundEffects />
        </div>
        
        {/* Main content area */}
        <main className="relative min-h-screen z-10">
          {children}
        </main>

        <FloatingActionMenu currentPath={location.pathname} />
      </div>
    </div>
  );
};

import { createContext, useContext, useState, ReactNode } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Ghost, Eye } from "lucide-react";

interface GhostModeContextType {
  isGhostMode: boolean;
  toggleGhostMode: () => void;
  isLoading: boolean;
}

const GhostModeContext = createContext<GhostModeContextType>({
  isGhostMode: false,
  toggleGhostMode: () => {},
  isLoading: false,
});

export const GhostModeProvider = ({ children }: { children: ReactNode }) => {
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  const { isSuperAdmin } = useSuperAdminCheck();
  const { toast } = useToast();

  const toggleGhostMode = async () => {
    // Only allow admins to toggle ghost mode
    if (!isSuperAdmin) return;
    
    setIsLoading(true);
    
    try {
      // Log the ghost mode usage for audit purposes
      if (session?.user?.id) {
        await supabase.from('admin_audit_logs').insert({
          user_id: session.user.id,
          action: isGhostMode ? 'ghost_mode_disabled' : 'ghost_mode_enabled',
          details: {
            timestamp: new Date().toISOString(),
            user_email: session.user.email,
          }
        });
      }
      
      setIsGhostMode(!isGhostMode);
      
      toast({
        title: isGhostMode ? "Ghost Mode Deactivated" : "Ghost Mode Activated",
        description: isGhostMode 
          ? "Your actions are now visible to users" 
          : "You are now browsing invisibly",
        // Remove the problematic 'icon' property
      });
    } catch (error) {
      console.error("Error toggling ghost mode:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GhostModeContext.Provider value={{ isGhostMode, toggleGhostMode, isLoading }}>
      {children}
      
      {isSuperAdmin && isGhostMode && (
        <div className="fixed bottom-16 left-4 z-50 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-white border border-purple-500/30 shadow-lg flex items-center space-x-1">
          <Ghost className="h-3.5 w-3.5 text-purple-400" />
          <span>Ghost Mode Active</span>
        </div>
      )}
    </GhostModeContext.Provider>
  );
};

export const useGhostMode = () => useContext(GhostModeContext);

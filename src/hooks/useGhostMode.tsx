
import { useState, useEffect, createContext, useContext } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Create a context for ghost mode
interface GhostModeContextType {
  isGhostMode: boolean;
  toggleGhostMode: () => Promise<void>;
  isLoading: boolean;
}

const GhostModeContext = createContext<GhostModeContextType | null>(null);

export const GhostModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const session = useSession();
  const { toast } = useToast();

  // Fetch initial ghost mode status
  useEffect(() => {
    if (session?.user?.id) {
      const fetchGhostModeStatus = async () => {
        try {
          const { data, error } = await supabase
            .from("admin_settings")
            .select("ghost_mode_active")
            .eq("user_id", session.user.id)
            .single();

          if (error) {
            console.error("Error fetching ghost mode status:", error);
            setIsGhostMode(false);
          } else {
            setIsGhostMode(data?.ghost_mode_active || false);
          }
        } catch (err) {
          console.error("Failed to fetch ghost mode status:", err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchGhostModeStatus();
    }
  }, [session?.user?.id]);

  // Toggle ghost mode function
  const toggleGhostMode = async () => {
    if (!session?.user?.id) return;
    
    setIsLoading(true);
    try {
      const newStatus = !isGhostMode;
      
      const { error } = await supabase
        .from("admin_settings")
        .upsert({
          user_id: session.user.id,
          ghost_mode_active: newStatus
        });

      if (error) {
        console.error("Error toggling ghost mode:", error);
        toast({
          title: "Error",
          description: "Could not toggle ghost mode",
          variant: "destructive"
        });
      } else {
        setIsGhostMode(newStatus);
        toast({
          title: newStatus ? "Ghost Mode Activated" : "Ghost Mode Deactivated",
          description: newStatus 
            ? "You are now browsing in ghost mode. Your actions will not be visible to regular users." 
            : "You are now browsing in normal mode."
        });
      }
    } catch (err) {
      console.error("Failed to toggle ghost mode:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GhostModeContext.Provider value={{ isGhostMode, toggleGhostMode, isLoading }}>
      {children}
    </GhostModeContext.Provider>
  );
};

// Hook for using ghost mode
export const useGhostMode = () => {
  const context = useContext(GhostModeContext);
  
  if (!context) {
    return {
      isGhostMode: false,
      toggleGhostMode: async () => {},
      isLoading: false
    };
  }
  
  return context;
};

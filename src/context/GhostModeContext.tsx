import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { GhostModeContextType } from "./ghost/types";
import { LiveSession } from "@/components/admin/platform/surveillance/types";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/useUser";
import { LiveAlert } from "@/types/alerts";

const GhostModeContext = createContext<GhostModeContextType | undefined>(
  undefined
);

export const GhostModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSurveillance, setActiveSurveillance] = useState<{
    session?: LiveSession;
    isWatching: boolean;
    startTime?: string;
  }>({ isWatching: false });
  const [liveAlerts, setLiveAlerts] = useState<LiveAlert[]>([]);
  const [canUseGhostMode, setCanUseGhostMode] = useState(false);
  const { toast } = useToast();
  const session = useSession();
  const { user } = useUser();

  const syncGhostModeFromSupabase = useCallback(async () => {
    setIsLoading(true);
    try {
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from("profiles")
          .select("is_ghost_mode, user_roles")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Error fetching ghost mode status:", error);
          toast({
            title: "Error",
            description: "Failed to sync ghost mode status.",
            variant: "destructive",
          });
        } else {
          setIsGhostMode(data?.is_ghost_mode || false);
          const isAdmin = data?.user_roles?.role === "admin";
          setCanUseGhostMode(isAdmin);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, toast]);

  useEffect(() => {
    syncGhostModeFromSupabase();
  }, [syncGhostModeFromSupabase]);

  const toggleGhostMode = async () => {
    setIsLoading(true);
    try {
      if (session?.user?.id) {
        const { error } = await supabase
          .from("profiles")
          .update({ is_ghost_mode: !isGhostMode })
          .eq("id", session.user.id);

        if (error) {
          console.error("Error toggling ghost mode:", error);
          toast({
            title: "Error",
            description: "Failed to toggle ghost mode.",
            variant: "destructive",
          });
        } else {
          setIsGhostMode(!isGhostMode);
          toast({
            title: "Success",
            description: `Ghost mode ${
              !isGhostMode ? "enabled" : "disabled"
            }.`,
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const startSurveillance = async (session: LiveSession) => {
    setIsLoading(true);
    try {
      setActiveSurveillance({
        session,
        isWatching: true,
        startTime: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error("Error starting surveillance:", error);
      toast({
        title: "Error",
        description: "Failed to start surveillance.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const stopSurveillance = async () => {
    setIsLoading(true);
    try {
      setActiveSurveillance({ isWatching: false });
      return true;
    } catch (error) {
      console.error("Error stopping surveillance:", error);
      toast({
        title: "Error",
        description: "Failed to stop surveillance.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAlerts = useCallback(async () => {
    setIsLoading(true);
    try {
      if (session?.user) {
        const { data, error } = await supabase
          .from("alerts")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching alerts:", error);
          toast({
            title: "Error",
            description: "Failed to refresh alerts.",
            variant: "destructive",
          });
        } else {
          setLiveAlerts(data);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [session?.user, toast]);

  useEffect(() => {
    if (isGhostMode) {
      refreshAlerts();
    }
  }, [isGhostMode, refreshAlerts]);

  const value: GhostModeContextType = {
    isGhostMode,
    toggleGhostMode,
    isLoading,
    activeSurveillance,
    startSurveillance,
    stopSurveillance,
    liveAlerts,
    refreshAlerts,
    setIsGhostMode,
    syncGhostModeFromSupabase,
    canUseGhostMode,
  };

  return (
    <GhostModeContext.Provider value={value}>{children}</GhostModeContext.Provider>
  );
};

export const useGhostMode = () => {
  const context = useContext(GhostModeContext);
  if (context === undefined) {
    throw new Error("useGhostMode must be used within a GhostModeProvider");
  }
  return context;
};

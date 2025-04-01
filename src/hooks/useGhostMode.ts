
import { useGhostMode as useGhostModeContext } from "@/context/GhostModeContext";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";
import { useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";

export const useGhostMode = () => {
  const { 
    isGhostMode, 
    toggleGhostMode, 
    isLoading, 
    activeSurveillance,
    startSurveillance,
    stopSurveillance,
    liveAlerts,
    refreshAlerts
  } = useGhostModeContext();
  const { isSuperAdmin } = useSuperAdminCheck();
  const session = useSession();
  
  // Add debugging
  useEffect(() => {
    if (session?.user?.email === "hamzaishtiaq242@gmail.com") {
      console.log("God mode user detected in useGhostMode");
      console.log("isSuperAdmin status:", isSuperAdmin);
      console.log("Ghost mode active:", isGhostMode);
      console.log("Live alerts count:", liveAlerts.length);
    }
  }, [session, isSuperAdmin, isGhostMode, liveAlerts]);
  
  // If user is not a super admin, always return false for ghost mode
  return {
    isGhostMode: isSuperAdmin ? isGhostMode : false,
    toggleGhostMode,
    isLoading,
    canUseGhostMode: isSuperAdmin,
    activeSurveillance,
    startSurveillance,
    stopSurveillance,
    liveAlerts,
    refreshAlerts
  };
};

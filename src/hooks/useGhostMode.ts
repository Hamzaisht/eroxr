
import { useGhostMode as useGhostModeContext } from "@/context/GhostModeContext";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";

export const useGhostMode = () => {
  const { isGhostMode, toggleGhostMode, isLoading } = useGhostModeContext();
  const { isSuperAdmin } = useSuperAdminCheck();
  
  // If user is not a super admin, always return false for ghost mode
  return {
    isGhostMode: isSuperAdmin ? isGhostMode : false,
    toggleGhostMode,
    isLoading,
    canUseGhostMode: isSuperAdmin
  };
};

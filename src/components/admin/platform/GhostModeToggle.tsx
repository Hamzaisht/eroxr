
import { useGhostMode } from "@/hooks/useGhostMode";
import { Button } from "@/components/ui/button";
import { Ghost, Eye } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

export const GhostModeToggle = () => {
  const { isGhostMode, toggleGhostMode, canUseGhostMode, liveAlerts, isLoading: isGhostModeLoading } = useGhostMode();
  const [isToggling, setIsToggling] = useState(false);
  const session = useSession();

  const handleToggle = async () => {
    if (!canUseGhostMode) return;
    
    setIsToggling(true);
    try {
      await toggleGhostMode();

      // Log toggle to admin_logs (this is redundant as it's already done in the context, but adding for clarity)
      if (session?.user?.id) {
        await supabase.from('admin_logs').insert({
          admin_id: session.user.id,
          action: isGhostMode ? 'ghost_mode_disabled' : 'ghost_mode_enabled',
          action_type: 'toggle_ghost_mode',
          target_type: 'admin',
          target_id: session.user.id,
          details: {
            timestamp: new Date().toISOString(),
            previous_state: isGhostMode,
            new_state: !isGhostMode,
            component: 'GhostModeToggle'
          }
        });
      }
    } finally {
      setIsToggling(false);
    }
  };

  if (!canUseGhostMode) return null;

  const pendingAlerts = (liveAlerts || []).length;
  const isLoading = isToggling || isGhostModeLoading;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isGhostMode ? "destructive" : "outline"}
            size="sm"
            className={`flex items-center gap-2 relative ${
              isGhostMode 
                ? "bg-purple-900/30 text-purple-300 border-purple-700/50 hover:bg-purple-800/40 hover:text-purple-200" 
                : "bg-[#161B22]/80"
            }`}
            onClick={handleToggle}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-dotted border-current" />
            ) : isGhostMode ? (
              <>
                <Ghost className="h-4 w-4" />
                <span className="hidden sm:inline">Ghost Mode</span>
                {pendingAlerts > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 p-0">
                    {pendingAlerts}
                  </Badge>
                )}
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Admin Mode</span>
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isLoading 
              ? "Updating ghost mode..."
              : isGhostMode 
                ? `Currently browsing invisibly${pendingAlerts > 0 ? ` (${pendingAlerts} alerts)` : ''}`
                : "Browse invisibly to moderate content"
            }
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};


import { useGhostMode } from "@/hooks/useGhostMode";
import { Button } from "@/components/ui/button";
import { Ghost, Eye, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export const GhostModeToggle = () => {
  const { isGhostMode, toggleGhostMode, canUseGhostMode, liveAlerts, isLoading: isGhostModeLoading } = useGhostMode();
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    if (!canUseGhostMode || isToggling || isGhostModeLoading) return;
    
    setIsToggling(true);
    try {
      await toggleGhostMode();
    } finally {
      setIsToggling(false);
    }
  };

  if (!canUseGhostMode) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-[#161B22]/80 flex items-center gap-2 relative opacity-50"
              disabled={true}
            >
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <span className="hidden sm:inline">Restricted Mode</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>You don't have permission to use Ghost Mode. Super Admin role required.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

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

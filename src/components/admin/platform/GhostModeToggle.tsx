
import { useGhostMode } from "@/hooks/useGhostMode";
import { Button } from "@/components/ui/button";
import { Ghost, Eye } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

export const GhostModeToggle = () => {
  const { isGhostMode, toggleGhostMode, canUseGhostMode } = useGhostMode();
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    if (!canUseGhostMode) return;
    
    setIsToggling(true);
    try {
      await toggleGhostMode();
    } finally {
      setIsToggling(false);
    }
  };

  if (!canUseGhostMode) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isGhostMode ? "destructive" : "outline"}
            size="sm"
            className={`flex items-center gap-2 ${isGhostMode ? "bg-purple-900/30 text-purple-300 border-purple-700/50" : "bg-[#161B22]/80"}`}
            onClick={handleToggle}
            disabled={isToggling}
          >
            {isGhostMode ? (
              <>
                <Ghost className="h-4 w-4" />
                <span className="hidden sm:inline">Ghost Mode</span>
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
          <p>{isGhostMode ? "Currently browsing invisibly" : "Browse invisibly"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

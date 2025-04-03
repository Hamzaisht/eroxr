
import { useState } from "react";
import { Ghost } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useGhostMode } from "@/hooks/useGhostMode";

interface GhostModeToggleProps {
  canUseGhostMode: boolean;
}

export const GhostModeToggle = ({ canUseGhostMode }: GhostModeToggleProps) => {
  const { isGhostMode, toggleGhostMode, isLoading: isGhostModeLoading } = useGhostMode();
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

  if (!canUseGhostMode) return null;

  const isLoading = isToggling || isGhostModeLoading;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between bg-[#161B22] p-3 rounded-md border border-white/5">
        <div className="flex items-center gap-2">
          {isGhostMode ? (
            <Ghost className="h-5 w-5 text-purple-400" />
          ) : (
            <Ghost className="h-5 w-5 text-gray-400" />
          )}
          <span>Ghost Mode</span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                {isLoading && (
                  <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-dotted border-current" />
                )}
                <Switch 
                  checked={isGhostMode} 
                  onCheckedChange={handleToggle}
                  disabled={isLoading}
                  className={isGhostMode ? "bg-purple-600" : ""}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{isLoading ? "Updating ghost mode..." : isGhostMode ? "Invisible browsing active" : "Browse invisibly"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

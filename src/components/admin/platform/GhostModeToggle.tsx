
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useGhostMode } from "@/hooks/useGhostMode";
import { useToast } from "@/hooks/use-toast";

export const GhostModeToggle = () => {
  const { isGhostMode, canUseGhostMode, toggleGhostMode } = useGhostMode();
  const { toast } = useToast();
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleGhostMode = async () => {
    if (!canUseGhostMode) {
      toast({
        title: "Ghost Mode Unavailable",
        description: "You don't have permission to use Ghost Mode.",
        variant: "destructive"
      });
      return;
    }

    setIsToggling(true);
    
    try {
      await toggleGhostMode();
      
      toast({
        title: isGhostMode ? "Ghost Mode Deactivated" : "Ghost Mode Activated",
        description: isGhostMode 
          ? "Your actions are now visible to users." 
          : "You are now browsing invisibly. Users cannot see your actions.",
      });
    } catch (error) {
      console.error("Error toggling ghost mode:", error);
      toast({
        title: "Error",
        description: "Failed to toggle Ghost Mode. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-black/20 rounded-md mb-6">
      <div className="flex items-center gap-2">
        {isGhostMode ? (
          <EyeOff className="h-5 w-5 text-purple-400" />
        ) : (
          <Eye className="h-5 w-5 text-muted-foreground" />
        )}
        <span className={isGhostMode ? "text-purple-400 font-medium" : "text-muted-foreground"}>
          Ghost Mode
        </span>
      </div>
      
      <Switch
        checked={isGhostMode}
        onCheckedChange={handleToggleGhostMode}
        disabled={isToggling || !canUseGhostMode}
        className={isGhostMode ? "bg-purple-600" : ""}
      />
    </div>
  );
};


import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Ghost } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useGhostMode } from "@/hooks/useGhostMode";
import { supabase } from "@/integrations/supabase/client";

export const GodModeToggle = () => {
  const { isGhostMode, toggleGhostMode, isLoading: isGhostLoading } = useGhostMode();
  const [isToggling, setIsToggling] = useState(false);
  const session = useSession();
  
  const handleToggleGhostMode = async () => {
    if (isToggling || isGhostLoading) return;
    
    setIsToggling(true);
    try {
      await toggleGhostMode();
      
      // Update session in Supabase (this is already done in the context, but here for clarity)
      if (session?.user?.id) {
        await supabase
          .from('admin_sessions')
          .upsert({
            admin_id: session.user.id,
            ghost_mode: !isGhostMode,
            activated_at: !isGhostMode ? new Date() : null,
            last_active_at: new Date()
          }, {
            onConflict: 'admin_id'
          });
      }
    } finally {
      setIsToggling(false);
    }
  };

  const isLoading = isToggling || isGhostLoading;

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
                  onCheckedChange={handleToggleGhostMode}
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

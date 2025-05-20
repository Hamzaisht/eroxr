
import { Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useGhostMode } from "@/hooks/useGhostMode";
import { useState } from "react";

export const GhostModePrompt = () => {
  const { toast } = useToast();
  const { toggleGhostMode } = useGhostMode();
  const [isToggling, setIsToggling] = useState(false);
  
  const handleEnableGhostMode = async () => {
    setIsToggling(true);
    try {
      toggleGhostMode();
      toast({
        title: "Ghost Mode Enabled",
        description: "You are now browsing invisibly."
      });
    } catch (error) {
      console.error("Error enabling ghost mode:", error);
      toast({
        title: "Failed to Enable Ghost Mode",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsToggling(false);
    }
  };
  
  const loading = isToggling;
  
  return (
    <div className="p-8 text-center bg-[#161B22]/80 border border-purple-900/20 rounded-lg max-w-md mx-auto my-12">
      <Ghost className="h-12 w-12 mx-auto mb-4 text-purple-400" />
      <h2 className="text-2xl font-bold mb-2">Ghost Mode Required</h2>
      <p className="text-gray-400 mb-6">
        You must enable Ghost Mode to access the surveillance dashboard.
        This ensures your monitoring activities remain invisible to users.
      </p>
      <Button
        onClick={handleEnableGhostMode}
        className="bg-purple-900 hover:bg-purple-800 text-white"
        disabled={loading}
      >
        {loading ? (
          <>
            <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-dotted border-current" />
            Enabling Ghost Mode...
          </>
        ) : (
          <>
            <Ghost className="h-4 w-4 mr-2" />
            Enable Ghost Mode
          </>
        )}
      </Button>
    </div>
  );
};

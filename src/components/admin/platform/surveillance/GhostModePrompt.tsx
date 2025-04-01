

import { Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const GhostModePrompt = () => {
  const { toast } = useToast();
  
  return (
    <div className="p-8 text-center">
      <Ghost className="h-12 w-12 mx-auto mb-4 text-purple-400" />
      <h2 className="text-2xl font-bold mb-2">Ghost Mode Required</h2>
      <p className="text-gray-400 mb-4">
        You must be in Ghost Mode to access the surveillance dashboard.
      </p>
      <Button
        onClick={() => toast({
          title: "Ghost Mode Required",
          description: "Enable Ghost Mode in the admin sidebar to continue."
        })}
        className="bg-purple-900 hover:bg-purple-800"
      >
        <Ghost className="h-4 w-4 mr-2" />
        Enable Ghost Mode
      </Button>
    </div>
  );
};


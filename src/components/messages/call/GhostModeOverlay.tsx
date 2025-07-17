
import { Button } from "@/components/ui/button";
import { Ghost, Camera } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface GhostModeOverlayProps {
  isActive: boolean;
  onExit: () => void;
  onRecord: () => void;
}

export function GhostModeOverlay({ isActive, onExit, onRecord }: GhostModeOverlayProps) {
  const session = useSession();
  const { toast } = useToast();
  
  if (!isActive) return null;
  
  const handleRecordEvidence = async () => {
    try {
      // Log the recording action for audit purposes
      if (session?.user?.id) {
        await supabase.from('admin_action_logs').insert({
          admin_id: session.user.id,
          action: 'ghost_surveillance_recording',
          action_type: 'ghost_mode',
          target_type: 'call_recording',
          target_id: 'surveillance',
          details: {
            timestamp: new Date().toISOString(),
            admin_email: session.user.email,
            ghost_mode: true,
            surveillance_recording: true
          },
          ip_address: null,
          user_agent: navigator.userAgent
        });
      }
      
      // Call the provided onRecord function
      onRecord();
      
      toast({
        title: "Recording Started",
        description: "Evidence recording has been initiated",
      });
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };
  
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 text-white p-4">
      <Ghost className="h-12 w-12 text-purple-500 mb-4" />
      <h3 className="text-xl font-bold mb-2">Ghost Mode Active</h3>
      <p className="text-center mb-4">
        You are monitoring this call invisibly. The user cannot see or hear you.
      </p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onExit} className="border-red-500 text-red-500">
          Exit Surveillance
        </Button>
        <Button 
          className="bg-purple-600 hover:bg-purple-700"
          onClick={handleRecordEvidence}
        >
          <Camera className="h-4 w-4 mr-2" />
          Record Evidence
        </Button>
      </div>
    </div>
  );
}

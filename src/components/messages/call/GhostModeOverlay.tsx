
import { Button } from "@/components/ui/button";
import { Ghost, Camera } from "lucide-react";

interface GhostModeOverlayProps {
  isActive: boolean;
  onExit: () => void;
  onRecord: () => void;
}

export function GhostModeOverlay({ isActive, onExit, onRecord }: GhostModeOverlayProps) {
  if (!isActive) return null;
  
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
          onClick={onRecord}
        >
          <Camera className="h-4 w-4 mr-2" />
          Record Evidence
        </Button>
      </div>
    </div>
  );
}

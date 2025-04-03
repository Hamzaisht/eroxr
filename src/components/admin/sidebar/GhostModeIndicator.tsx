
import { Ghost } from "lucide-react";

interface GhostModeIndicatorProps {
  isGhostMode: boolean;
}

export const GhostModeIndicator = ({ isGhostMode }: GhostModeIndicatorProps) => {
  if (!isGhostMode) return null;
  
  return (
    <div className="absolute bottom-4 left-4 right-4">
      <div className="bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg text-sm text-white border border-purple-500/30 shadow-lg flex items-center gap-2">
        <Ghost className="h-4 w-4 text-purple-400" />
        <span className="text-purple-200">Ghost Mode Active</span>
      </div>
    </div>
  );
};

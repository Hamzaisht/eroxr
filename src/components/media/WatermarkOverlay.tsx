
import { useState, useEffect } from "react";
import { getUsernameForWatermark } from "@/utils/watermarkUtils";

interface WatermarkOverlayProps {
  username: string;
  creatorId?: string;  // Added creatorId as optional prop
  className?: string;
}

export const WatermarkOverlay = ({ username, creatorId, className = "" }: WatermarkOverlayProps) => {
  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
    // If creatorId is provided, use that, otherwise use username
    const idToUse = creatorId || username;
    
    getUsernameForWatermark(idToUse)
      .then(name => setDisplayName(name))
      .catch(err => console.error("Error fetching watermark name:", err));
  }, [username, creatorId]);

  if (!displayName) return null;

  return (
    <div className={`absolute bottom-2 right-2 text-xs text-white/60 bg-black/30 px-2 py-1 rounded ${className}`}>
      @{displayName}
    </div>
  );
};

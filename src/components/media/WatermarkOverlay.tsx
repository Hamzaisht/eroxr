
import { useState, useEffect } from "react";
import { getUsernameForWatermark } from "@/utils/watermarkUtils";

interface WatermarkOverlayProps {
  username: string;
  className?: string;
}

export const WatermarkOverlay = ({ username, className = "" }: WatermarkOverlayProps) => {
  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
    getUsernameForWatermark(username)
      .then(name => setDisplayName(name))
      .catch(err => console.error("Error fetching watermark name:", err));
  }, [username]);

  if (!displayName) return null;

  return (
    <div className={`absolute bottom-2 right-2 text-xs text-white/60 bg-black/30 px-2 py-1 rounded ${className}`}>
      @{displayName}
    </div>
  );
};

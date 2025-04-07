import { useEffect, useState } from "react";
import { getUsernameForWatermark } from "@/utils/watermarkUtils";

interface WatermarkOverlayProps {
  username: string;
  creatorId?: string;
}

export const WatermarkOverlay = ({ username, creatorId }: WatermarkOverlayProps) => {
  const [displayName, setDisplayName] = useState<string>("eroxr-user");

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        // If username is already provided and looks like a username (not a UUID), use it directly
        if (username && username.length < 20 && !username.includes('-')) {
          setDisplayName(username);
          return;
        }
        
        // Otherwise try to get username from creatorId or fall back to provided username
        const sourceId = creatorId || username;
        
        if (!sourceId) {
          setDisplayName("eroxr-user");
          return;
        }
        
        const name = await getUsernameForWatermark(sourceId);
        setDisplayName(name || "eroxr-user");
      } catch (error) {
        console.error('Error in WatermarkOverlay:', error);
        setDisplayName(username || "eroxr-user");
      }
    };

    fetchUsername();
  }, [username, creatorId]);

  return (
    <div className="absolute bottom-2 right-2 text-white/60 text-xs sm:text-sm font-medium z-20 pointer-events-none select-none drop-shadow-md bg-black/20 px-2 py-1 backdrop-blur-sm rounded">
      www.eroxr.com/@{displayName}
    </div>
  );
};

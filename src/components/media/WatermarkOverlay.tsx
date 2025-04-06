
import { useEffect, useState } from "react";
import { getUsernameForWatermark } from "@/utils/watermarkUtils";

interface WatermarkOverlayProps {
  username: string;
  creatorId?: string;
}

export const WatermarkOverlay = ({ username, creatorId }: WatermarkOverlayProps) => {
  const [displayName, setDisplayName] = useState(username);

  useEffect(() => {
    const fetchUsername = async () => {
      if (creatorId) {
        try {
          const name = await getUsernameForWatermark(creatorId);
          setDisplayName(name);
        } catch (error) {
          console.error('Error fetching username for watermark:', error);
          setDisplayName(username);
        }
      } else {
        setDisplayName(username);
      }
    };

    fetchUsername();
  }, [username, creatorId]);

  return (
    <div className="absolute bottom-2 right-2 text-white/60 text-xs sm:text-sm font-medium z-20 pointer-events-none select-none drop-shadow-md">
      www.eroxr.com/@{displayName}
    </div>
  );
};

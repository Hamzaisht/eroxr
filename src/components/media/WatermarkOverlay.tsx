
import { useEffect, useState } from "react";

interface WatermarkOverlayProps {
  username: string;
}

export const WatermarkOverlay = ({ username }: WatermarkOverlayProps) => {
  const [displayName, setDisplayName] = useState(username);

  useEffect(() => {
    // For user IDs, try to extract the username portion
    if (username && username.length > 20) {
      setDisplayName('eroxr'); // Default until data loads
    } else {
      setDisplayName(username);
    }
  }, [username]);

  return (
    <div className="absolute bottom-2 right-2 text-white/60 text-xs sm:text-sm font-medium z-20 pointer-events-none select-none drop-shadow-md">
      www.eroxr.com/@{displayName}
    </div>
  );
};

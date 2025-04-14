
import React from "react";

export interface WatermarkOverlayProps {
  creatorId?: string;
  username: string;
  className?: string;
}

export const WatermarkOverlay = ({
  username,
  creatorId,
  className = ""
}: WatermarkOverlayProps) => {
  return (
    <div className={`absolute bottom-4 right-4 bg-black/40 px-2 py-1 rounded text-white text-xs ${className}`}>
      www.eroxr.com/@{username}
    </div>
  );
};


import React from 'react';

interface WatermarkOverlayProps {
  username: string;
}

export const WatermarkOverlay: React.FC<WatermarkOverlayProps> = ({ username }) => {
  return (
    <div className="watermark-overlay">
      www.eroxr.com/@{username}
    </div>
  );
};

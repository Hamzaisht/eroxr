
import { useEffect, useState } from 'react';
import { getUsernameForWatermark } from '@/utils/watermarkUtils';

interface WatermarkOverlayProps {
  username: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export const WatermarkOverlay = ({ 
  username,
  position = 'bottom-right'
}: WatermarkOverlayProps) => {
  const [displayName, setDisplayName] = useState<string>(username);
  
  useEffect(() => {
    // Try to get a prettier username if we have a UUID
    if (username.includes('-')) {
      getUsernameForWatermark(username).then(name => {
        if (name) setDisplayName(name);
      }).catch(error => {
        console.error("Error fetching watermark username:", error);
      });
    }
  }, [username]);
  
  const positionClass = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  }[position];
  
  return (
    <div className={`absolute ${positionClass} bg-black/50 text-white/80 px-3 py-1 rounded-md text-xs z-30 backdrop-blur-sm pointer-events-none select-none watermark-overlay`}>
      www.eroxr.com/@{displayName}
    </div>
  );
};

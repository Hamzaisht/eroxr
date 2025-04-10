
import { useRef, useEffect } from 'react';
import { Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DatingAd } from '../types/dating';
import { UniversalMedia } from '@/components/media/UniversalMedia';

interface VideoContentProps {
  ad: DatingAd;
  isActive: boolean;
  isHovered: boolean;
}

export const VideoContent = ({ ad, isActive, isHovered }: VideoContentProps) => {
  return (
    <div className="relative aspect-video w-full h-[60vh] overflow-hidden bg-black">
      {ad.video_url ? (
        <div className="w-full h-full flex items-center justify-center">
          <UniversalMedia
            item={ad}
            className={cn(
              "w-full h-full object-cover transition-all duration-500",
              isActive || isHovered ? "opacity-100" : "opacity-90 scale-[1.01]"
            )}
            autoPlay={isHovered || isActive}
            controls={false}
          />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-luxury-darker/50">
          <Video className="w-16 h-16 text-luxury-neutral/30" />
        </div>
      )}
    </div>
  );
};

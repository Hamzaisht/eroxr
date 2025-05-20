
import { motion } from 'framer-motion';
import { Video, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DatingAd } from '@/types/dating';
import { UniversalMedia } from '@/components/media/UniversalMedia';
import { MediaType } from '@/types/media';
import { useState } from 'react';

interface VideoContentProps {
  ad: DatingAd;
  isActive: boolean;
  isHovered: boolean;
  isAnimation?: boolean;
}

export const VideoContent = ({ ad, isActive, isHovered, isAnimation = false }: VideoContentProps) => {
  const [hasError, setHasError] = useState(false);
  
  const variants = {
    idle: { scale: 1.01, opacity: 0.9 },
    active: { scale: 1, opacity: 1 }
  };

  const videoUrl = ad.video_url || ad.videoUrl;
  
  const handleError = () => {
    setHasError(true);
    console.error("Video loading error for ad:", ad.id);
  };

  return (
    <div className="relative aspect-video w-full h-[60vh] overflow-hidden bg-black">
      {videoUrl && !hasError ? (
        <motion.div 
          className="w-full h-full flex items-center justify-center"
          variants={isAnimation ? variants : undefined}
          initial="idle"
          animate={(isActive || isHovered) ? "active" : "idle"}
          transition={{ duration: 0.5 }}
        >
          <UniversalMedia
            item={{
              url: videoUrl,
              type: MediaType.VIDEO
            }}
            className={cn(
              "w-full h-full object-cover"
            )}
            autoPlay={isHovered || isActive}
            controls={false}
            onError={handleError}
            maxRetries={2}
          />
          
          {/* Overlay for animation effects */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"
            animate={{ 
              opacity: (isActive || isHovered) ? 0.3 : 0.5
            }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-luxury-darker/50">
          {hasError ? (
            <>
              <AlertCircle className="w-12 h-12 text-red-500/70 mb-2" />
              <p className="text-luxury-neutral/70">Failed to load video</p>
            </>
          ) : (
            <Video className="w-16 h-16 text-luxury-neutral/30" />
          )}
          
          {ad.avatar_url && (
            <div className="absolute inset-0 z-0 opacity-20">
              <img 
                src={ad.avatar_url} 
                alt="Profile background" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

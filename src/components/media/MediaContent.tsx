
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getEnlargedImageStyles, generateSrcSet, getResponsiveSizes } from "@/lib/image-utils";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getUsernameForWatermark } from "@/utils/watermarkUtils";

interface MediaContentProps {
  url: string;
  isVideo: boolean;
}

export const MediaContent = ({ url, isVideo }: MediaContentProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState<string>('eroxr');
  
  // Extract creator ID from URL path if available
  useEffect(() => {
    const getUsername = async () => {
      const urlParts = url.split('/');
      const possibleCreatorId = urlParts[urlParts.length - 2];
      
      if (possibleCreatorId && possibleCreatorId.length > 20) {
        try {
          const name = await getUsernameForWatermark(possibleCreatorId);
          setUsername(name);
        } catch (error) {
          console.error('Error getting username for watermark:', error);
        }
      }
    };
    
    getUsername();
  }, [url]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full flex items-center justify-center p-4 bg-black/75 relative"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      )}
      
      {isVideo ? (
        <div className="relative max-w-[95vw] max-h-[95vh]">
          <video
            src={url}
            className={cn(
              "max-w-[95vw] max-h-[95vh] w-auto h-auto object-contain",
              "rounded-lg shadow-xl"
            )}
            controls
            autoPlay
            playsInline
            preload="auto"
            onLoadedMetadata={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
          <div className="watermark-overlay">
            www.eroxr.com/@{username}
          </div>
        </div>
      ) : (
        <div className="relative max-w-[95vw] max-h-[95vh]">
          <img
            src={url}
            alt="Enlarged media"
            className={cn(
              "max-w-[95vw] max-h-[95vh] w-auto h-auto object-contain",
              "rounded-lg shadow-xl"
            )}
            style={getEnlargedImageStyles()}
            srcSet={generateSrcSet(url)}
            sizes={getResponsiveSizes()}
            loading="eager"
            decoding="sync"
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
          <div className="watermark-overlay">
            www.eroxr.com/@{username}
          </div>
        </div>
      )}
    </motion.div>
  );
};

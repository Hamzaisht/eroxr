import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getEnlargedImageStyles, generateSrcSet, getResponsiveSizes } from "@/lib/image-utils";

interface MediaContentProps {
  url: string;
  isVideo: boolean;
}

export const MediaContent = ({ url, isVideo }: MediaContentProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full flex items-center justify-center p-4"
    >
      {isVideo ? (
        <video
          src={url}
          className={cn(
            "max-w-[95vw] max-h-[95vh] w-auto h-auto object-contain",
            "rounded-lg"
          )}
          controls
          autoPlay
          playsInline
          preload="auto"
          onLoadedMetadata={(e) => {
            const video = e.currentTarget;
            video.play().catch(error => {
              console.error("Error playing video:", error);
            });
          }}
        />
      ) : (
        <img
          src={url}
          alt="Enlarged media"
          className={cn(
            "max-w-[95vw] max-h-[95vh] w-auto h-auto object-contain",
            "rounded-lg"
          )}
          style={getEnlargedImageStyles()}
          srcSet={generateSrcSet(url)}
          sizes={getResponsiveSizes()}
          loading="eager"
          decoding="sync"
        />
      )}
    </motion.div>
  );
};
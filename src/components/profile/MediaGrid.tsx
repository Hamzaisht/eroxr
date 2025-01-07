import { Lock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { MediaViewer } from "@/components/media/MediaViewer";
import { getImageStyles, getAspectRatioFromDimensions } from "@/lib/image-utils";

interface MediaItem {
  id: number;
  type: string;
  url: string;
  isPremium: boolean;
  width?: number;
  height?: number;
}

interface MediaGridProps {
  items: MediaItem[];
  onImageClick: (url: string) => void;
}

export const MediaGrid = ({ items, onImageClick }: MediaGridProps) => {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const handleImageClick = (url: string) => {
    if (!url) return;
    setSelectedMedia(url);
    onImageClick(url);
  };

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-3 gap-1"
      >
        {items.map((mediaItem) => {
          const aspectRatio = mediaItem.width && mediaItem.height 
            ? getAspectRatioFromDimensions(mediaItem.width, mediaItem.height)
            : '1:1';

          return (
            <motion.div
              key={mediaItem.id}
              variants={item}
              whileHover={{ scale: 1.02 }}
              className={cn(
                "relative cursor-pointer overflow-hidden",
                "aspect-square" // Default to square
              )}
              onClick={() => !mediaItem.isPremium && handleImageClick(mediaItem.url)}
            >
              <div className="relative w-full h-full">
                <img
                  src={mediaItem.url}
                  alt="Media content"
                  className={cn(
                    "w-full h-full",
                    mediaItem.isPremium ? "blur-lg" : "",
                    "hover:opacity-90 transition-opacity duration-200"
                  )}
                  style={getImageStyles(aspectRatio)}
                  loading="lazy"
                />
                {mediaItem.isPremium && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                    <Lock className="w-8 h-8 text-primary mb-2" />
                    <p className="text-white font-medium text-sm">Premium Content</p>
                    <Button 
                      size="sm"
                      variant="secondary"
                      className="mt-2"
                    >
                      Subscribe to Unlock
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <MediaViewer 
        media={selectedMedia} 
        onClose={() => setSelectedMedia(null)} 
      />
    </>
  );
};
import { Lock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MediaItem {
  id: number;
  type: string;
  url: string;
  isPremium: boolean;
  aspectRatio?: "square" | "landscape" | "portrait"; // 1:1, 1.91:1, 4:5
}

interface MediaGridProps {
  items: MediaItem[];
  onImageClick: (url: string) => void;
}

export const MediaGrid = ({ items, onImageClick }: MediaGridProps) => {
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

  const getAspectRatioClass = (ratio?: string) => {
    switch (ratio) {
      case "landscape":
        return "aspect-[1.91/1]"; // 1080x566
      case "portrait":
        return "aspect-[4/5]"; // 1080x1350
      default:
        return "aspect-square"; // 1080x1080
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-3 gap-0.5 md:gap-1"
    >
      {items.map((mediaItem) => (
        <motion.div
          key={mediaItem.id}
          variants={item}
          whileHover={{ scale: 1.02 }}
          className={cn(
            "relative cursor-pointer overflow-hidden",
            getAspectRatioClass(mediaItem.aspectRatio)
          )}
          onClick={() => !mediaItem.isPremium && onImageClick(mediaItem.url)}
        >
          <div className="relative w-full h-full">
            <img
              src={mediaItem.url}
              alt="Media content"
              className={cn(
                "w-full h-full object-cover",
                mediaItem.isPremium ? "blur-lg" : ""
              )}
            />
            {mediaItem.isPremium && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                <Lock className="w-8 h-8 text-luxury-primary mb-2" />
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
      ))}
    </motion.div>
  );
};
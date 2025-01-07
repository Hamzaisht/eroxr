import { Lock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface MediaItem {
  id: number;
  type: string;
  url: string;
  isPremium: boolean;
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
          className="relative aspect-square cursor-pointer"
          onClick={() => !mediaItem.isPremium && onImageClick(mediaItem.url)}
        >
          <div className="relative w-full h-full">
            <img
              src={mediaItem.url}
              alt="Media content"
              className={`w-full h-full object-cover ${
                mediaItem.isPremium ? "blur-lg" : ""
              }`}
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
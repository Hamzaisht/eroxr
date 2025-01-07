import { Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";

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
        className="grid grid-cols-3 gap-0.5"
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
            onClick={() => !mediaItem.isPremium && handleImageClick(mediaItem.url)}
          >
            <div className="relative w-full h-full">
              <img
                src={mediaItem.url}
                alt="Media content"
                className={cn(
                  "w-full h-full object-cover",
                  mediaItem.isPremium ? "blur-lg" : ""
                )}
                loading="lazy"
                style={{ 
                  minWidth: "360px",
                  imageRendering: "crisp-edges"
                }}
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

      {/* Full-screen media viewer */}
      <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-transparent">
          <AnimatePresence>
            {selectedMedia && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="relative w-full h-full flex items-center justify-center"
              >
                <img
                  src={selectedMedia}
                  alt="Enlarged media"
                  className="max-w-full max-h-[95vh] object-contain"
                  style={{ imageRendering: "crisp-edges" }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
};
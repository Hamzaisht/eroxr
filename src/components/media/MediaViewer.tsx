import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getEnlargedImageStyles, generateSrcSet, getResponsiveSizes } from "@/lib/image-utils";

interface MediaViewerProps {
  media: string | null;
  onClose: () => void;
}

export const MediaViewer = ({ media, onClose }: MediaViewerProps) => {
  if (!media) return null;

  return (
    <Dialog open={!!media} onOpenChange={onClose}>
      <DialogContent className="max-w-[100vw] max-h-[100vh] h-screen w-screen p-0 border-none bg-black/95">
        <AnimatePresence>
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-50"
            >
              <X className="h-6 w-6 text-white" />
            </button>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex items-center justify-center p-4"
            >
              <img
                src={media}
                alt="Enlarged media"
                className={cn(
                  "max-w-[95%] max-h-[95vh] object-contain",
                  "rounded-lg shadow-2xl"
                )}
                style={getEnlargedImageStyles()}
                srcSet={generateSrcSet(media)}
                sizes={getResponsiveSizes()}
                loading="eager"
                decoding="sync"
              />
            </motion.div>
          </div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
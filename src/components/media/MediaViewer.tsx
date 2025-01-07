import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getEnlargedImageStyles, generateSrcSet, getResponsiveSizes } from "@/lib/image-utils";
import { useEffect, useState, useCallback } from "react";

interface MediaViewerProps {
  media: string | null;
  onClose: () => void;
  allMedia?: string[];
  initialIndex?: number;
}

export const MediaViewer = ({ media, onClose, allMedia = [], initialIndex = 0 }: MediaViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const currentMedia = media || allMedia[currentIndex];
  
  const handlePrevious = useCallback(() => {
    if (allMedia.length > 1) {
      setCurrentIndex((prev) => (prev === 0 ? allMedia.length - 1 : prev - 1));
    }
  }, [allMedia.length]);

  const handleNext = useCallback(() => {
    if (allMedia.length > 1) {
      setCurrentIndex((prev) => (prev === allMedia.length - 1 ? 0 : prev + 1));
    }
  }, [allMedia.length]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft":
        handlePrevious();
        break;
      case "ArrowRight":
      case "ArrowDown":
        handleNext();
        break;
      case "ArrowUp":
        handlePrevious();
        break;
      case "Escape":
        onClose();
        break;
      default:
        break;
    }
  }, [handleNext, handlePrevious, onClose]);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.deltaY > 0) {
      handleNext();
    } else {
      handlePrevious();
    }
  }, [handleNext, handlePrevious]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [handleKeyDown, handleWheel]);

  if (!currentMedia) return null;

  const isVideo = currentMedia.toLowerCase().endsWith('.mp4');

  return (
    <Dialog open={!!currentMedia} onOpenChange={onClose}>
      <DialogContent className="max-w-screen max-h-screen h-screen w-screen p-0 border-none bg-black/95">
        <AnimatePresence>
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-50"
            >
              <X className="h-6 w-6 text-white" />
            </button>
            
            {allMedia.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-50"
                >
                  <ChevronLeft className="h-6 w-6 text-white" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-50"
                >
                  <ChevronRight className="h-6 w-6 text-white" />
                </button>
              </>
            )}
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex items-center justify-center p-4"
            >
              {isVideo ? (
                <video
                  src={currentMedia}
                  className={cn(
                    "max-w-[95vw] max-h-[95vh] w-auto h-auto object-contain",
                    "rounded-lg"
                  )}
                  controls
                  autoPlay
                  playsInline
                />
              ) : (
                <img
                  src={currentMedia}
                  alt="Enlarged media"
                  className={cn(
                    "max-w-[95vw] max-h-[95vh] w-auto h-auto object-contain",
                    "rounded-lg"
                  )}
                  style={getEnlargedImageStyles()}
                  srcSet={generateSrcSet(currentMedia)}
                  sizes={getResponsiveSizes()}
                  loading="eager"
                  decoding="sync"
                />
              )}
            </motion.div>
          </div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
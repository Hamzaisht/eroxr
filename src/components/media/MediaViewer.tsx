import { AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useState, useCallback } from "react";
import { MediaControls } from "./MediaControls";
import { CloseButton } from "./CloseButton";
import { MediaContent } from "./MediaContent";

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
            <CloseButton onClose={onClose} />
            <MediaControls 
              showControls={allMedia.length > 1}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
            <MediaContent url={currentMedia} isVideo={isVideo} />
          </div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
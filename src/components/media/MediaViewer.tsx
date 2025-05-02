
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { isVideoUrl, isImageUrl, isAudioUrl } from "@/utils/media/urlUtils";

interface MediaViewerProps {
  media: string;
  mediaList?: string[];
  onClose: () => void;
  creatorId?: string;
}

export const MediaViewer = ({
  media,
  mediaList,
  onClose,
  creatorId
}: MediaViewerProps) => {
  const [currentMedia, setCurrentMedia] = useState(media);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // When the media prop changes, update currentMedia
    setCurrentMedia(media);
    setIsLoading(true);
    setError(null);
    
    // If we have a mediaList, find the index of the current media
    if (mediaList?.length) {
      const index = mediaList.findIndex(m => m === media);
      if (index !== -1) {
        setCurrentIndex(index);
      } else {
        setCurrentIndex(0);
      }
    }
  }, [media, mediaList]);

  // Handle next/previous navigation
  const handleNext = () => {
    if (!mediaList || mediaList.length <= 1) return;
    
    const nextIndex = (currentIndex + 1) % mediaList.length;
    setCurrentIndex(nextIndex);
    setCurrentMedia(mediaList[nextIndex]);
    setIsLoading(true);
  };

  const handlePrevious = () => {
    if (!mediaList || mediaList.length <= 1) return;
    
    const prevIndex = (currentIndex - 1 + mediaList.length) % mediaList.length;
    setCurrentIndex(prevIndex);
    setCurrentMedia(mediaList[prevIndex]);
    setIsLoading(true);
  };

  const handleDownload = () => {
    // Create a link element to trigger download
    const link = document.createElement("a");
    link.href = currentMedia;
    link.download = currentMedia.split("/").pop() || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMediaLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleMediaError = () => {
    setIsLoading(false);
    setError("Failed to load media. Please try again.");
  };

  return (
    <Dialog open={!!currentMedia} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 gap-0 bg-black/90 border-white/10">
        <div className="absolute top-2 right-2 z-20 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-black/40 hover:bg-black/70 text-white"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-black/40 hover:bg-black/70 text-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-center h-full w-full relative">
          {/* Loading state */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center z-10"
              >
                <div className="h-10 w-10 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error state */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-black/50 p-4 rounded-lg text-white text-center">
                <p className="mb-2">{error}</p>
                <Button variant="outline" onClick={() => window.open(currentMedia, "_blank")}>
                  Open in new tab
                </Button>
              </div>
            </div>
          )}

          {/* Media content */}
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            {isImageUrl(currentMedia) ? (
              <motion.img
                key={`img-${currentMedia}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: isLoading ? 0 : 1, scale: isLoading ? 0.9 : 1 }}
                transition={{ duration: 0.3 }}
                src={currentMedia}
                alt="Media content"
                className="max-h-full max-w-full object-contain"
                onLoad={handleMediaLoad}
                onError={handleMediaError}
              />
            ) : isVideoUrl(currentMedia) ? (
              <motion.video
                key={`video-${currentMedia}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoading ? 0 : 1 }}
                src={currentMedia}
                controls
                autoPlay
                className="max-h-full max-w-full"
                onLoadedData={handleMediaLoad}
                onError={handleMediaError}
              />
            ) : isAudioUrl(currentMedia) ? (
              <div className="p-8 bg-gray-900 rounded-lg">
                <motion.audio
                  key={`audio-${currentMedia}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isLoading ? 0 : 1 }}
                  src={currentMedia}
                  controls
                  autoPlay
                  className="w-[300px]"
                  onLoadedData={handleMediaLoad}
                  onError={handleMediaError}
                />
              </div>
            ) : (
              <div className="p-8 bg-gray-900 rounded-lg text-white text-center">
                <p>Unsupported media type</p>
                <Button variant="outline" className="mt-2" onClick={() => window.open(currentMedia, "_blank")}>
                  Open in browser
                </Button>
              </div>
            )}
          </div>

          {/* Navigation arrows */}
          {mediaList && mediaList.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                className="absolute left-2 h-10 w-10 rounded-full bg-black/40 hover:bg-black/70 text-white"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="absolute right-2 h-10 w-10 rounded-full bg-black/40 hover:bg-black/70 text-white"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>

        {/* Media count indicator */}
        {mediaList && mediaList.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <div className="bg-black/50 px-3 py-1 rounded-full text-white text-sm">
              {currentIndex + 1} / {mediaList.length}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

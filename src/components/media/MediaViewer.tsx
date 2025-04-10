
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getUsernameForWatermark } from "@/utils/watermarkUtils";
import { UniversalMedia } from "./UniversalMedia";

interface MediaViewerProps {
  media: string | null;
  onClose: () => void;
  creatorId?: string | undefined;
}

export const MediaViewer = ({ media, onClose, creatorId }: MediaViewerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [watermarkUsername, setWatermarkUsername] = useState<string | null>(null);
  
  // Determine media type
  const isVideo = media ? 
    media.toLowerCase().endsWith('.mp4') || 
    media.toLowerCase().endsWith('.webm') || 
    media.toLowerCase().endsWith('.mov') : false;
  
  const mediaItem = {
    media_url: !isVideo ? media : null,
    video_url: isVideo ? media : null,
    creator_id: creatorId,
    media_type: isVideo ? "video" : "image"
  };
  
  // Get watermark username if creatorId is provided
  useEffect(() => {
    if (creatorId) {
      getUsernameForWatermark(creatorId)
        .then(username => setWatermarkUsername(username))
        .catch(err => console.error("Error getting watermark username:", err));
    }
  }, [creatorId]);
  
  const handleDownload = () => {
    if (!media) return;
    
    const link = document.createElement('a');
    link.href = media;
    link.download = `media-${Date.now()}${isVideo ? '.mp4' : '.jpg'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };
  
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    console.error("Error loading media:", media);
  };
  
  return (
    <Dialog open={!!media} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0 bg-black/90 border-luxury-primary/20">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Loading spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <Loader2 className="h-10 w-10 text-luxury-primary animate-spin" />
            </div>
          )}
          
          {/* Error state */}
          {hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500 z-10">
              <AlertCircle className="h-16 w-16 mb-4" />
              <p className="text-lg">Failed to load media</p>
            </div>
          )}
          
          {/* Media content */}
          <AnimatePresence mode="wait">
            {media && !hasError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex items-center justify-center"
              >
                <UniversalMedia
                  item={mediaItem}
                  className="max-w-full max-h-full object-contain"
                  onLoad={handleLoad}
                  onError={handleError}
                  autoPlay={isVideo}
                  controls={isVideo}
                />
                
                {watermarkUsername && (
                  <div className="absolute bottom-4 right-4 text-xs text-white/60 bg-black/30 px-2 py-1 rounded z-20">
                    @{watermarkUsername}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Controls */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-30">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 text-white"
              onClick={handleDownload}
              disabled={isLoading || hasError}
            >
              <Download className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 text-white"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

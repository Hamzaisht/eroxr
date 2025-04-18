
import { motion } from "framer-motion";
import { X, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Media } from "@/components/shared/media/Media";
import { useMediaProcessor } from "@/hooks/useMediaProcessor";
import { useState } from "react";

interface MediaViewerProps {
  media: string | null;
  onClose: () => void;
  creatorId?: string;
}

export const MediaViewer = ({ media, onClose, creatorId }: MediaViewerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const {
    mediaUrl,
    mediaType,
    isLoading,
    isError
  } = useMediaProcessor(media);
  
  const handleDownload = () => {
    if (!mediaUrl) return;
    
    const link = document.createElement('a');
    link.href = mediaUrl;
    link.download = `media-${Date.now()}${mediaType === 'video' ? '.mp4' : '.jpg'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  return (
    <Dialog open={!!media} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0 bg-black/90 border-luxury-primary/20">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Media content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full flex items-center justify-center"
            onClick={toggleFullscreen}
          >
            <Media
              source={media || ''}
              className={`max-w-full max-h-full object-contain ${isFullscreen ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
              autoPlay={mediaType === 'video'}
              controls={mediaType === 'video'}
            />
          </motion.div>
          
          {/* Error state */}
          {isError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500 z-10">
              <AlertCircle className="h-16 w-16 mb-4" />
              <p className="text-lg">Failed to load media</p>
            </div>
          )}
          
          {/* Controls */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-30">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 text-white"
              onClick={handleDownload}
              disabled={isLoading || isError}
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

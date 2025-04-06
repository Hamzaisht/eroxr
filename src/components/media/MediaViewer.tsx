
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MediaContent } from "./MediaContent";
import { useState } from "react"; // Import useState

export interface MediaViewerProps {
  media: string | null;
  onClose: () => void;
  creatorId?: string;
}

export const MediaViewer = ({ media, onClose, creatorId }: MediaViewerProps) => {
  const [isZoomed, setIsZoomed] = useState(false);

  if (!media) return null;

  const isVideo = media.match(/\.(mp4|webm|ogg)$/i);

  const handleMediaClick = () => {
    // Optional: Add zoom functionality if needed in the future
    setIsZoomed(!isZoomed);
  };

  return (
    <Dialog open={!!media} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-transparent border-none">
        <MediaContent 
          url={media} 
          isVideo={!!isVideo} 
          creatorId={creatorId}
          onClose={onClose}
          onMediaClick={handleMediaClick}
        />
      </DialogContent>
    </Dialog>
  );
};


import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MediaContent } from "./MediaContent";

export interface MediaViewerProps {
  media: string | null;
  onClose: () => void;
}

export const MediaViewer = ({ media, onClose }: MediaViewerProps) => {
  if (!media) return null;

  const isVideo = media.match(/\.(mp4|webm|ogg)$/i);

  return (
    <Dialog open={!!media} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-transparent border-none">
        <MediaContent url={media} isVideo={!!isVideo} />
      </DialogContent>
    </Dialog>
  );
};

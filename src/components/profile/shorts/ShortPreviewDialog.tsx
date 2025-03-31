
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Post } from "@/components/profile/shorts/types";

interface ShortPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedShort: Post | null;
}

export const ShortPreviewDialog = ({ open, onOpenChange, selectedShort }: ShortPreviewDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-black">
        {selectedShort && (
          <div className="relative w-full aspect-[9/16]">
            <video
              src={selectedShort.video_urls?.[0] || selectedShort.media_url[0]}
              poster={selectedShort.video_thumbnail_url}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

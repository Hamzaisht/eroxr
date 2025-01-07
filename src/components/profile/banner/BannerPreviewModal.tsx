import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface BannerPreviewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mediaUrl?: string;
  mediaType: 'video' | 'gif' | 'image';
}

export const BannerPreviewModal = ({
  isOpen,
  onOpenChange,
  mediaUrl,
  mediaType,
}: BannerPreviewModalProps) => {
  if (!mediaUrl) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-7xl p-0 overflow-hidden bg-transparent border-none">
        <VisuallyHidden>
          <DialogTitle>Profile Banner Preview</DialogTitle>
        </VisuallyHidden>
        {mediaType === 'video' ? (
          <video
            src={mediaUrl}
            className="w-full rounded-lg"
            controls
            autoPlay
            loop
            playsInline
          />
        ) : (
          <img
            src={mediaUrl}
            alt="Banner Preview"
            className="w-full rounded-lg"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
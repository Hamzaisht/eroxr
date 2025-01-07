import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { X } from "lucide-react";

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
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-50"
        >
          <X className="h-5 w-5 text-white" />
        </button>
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
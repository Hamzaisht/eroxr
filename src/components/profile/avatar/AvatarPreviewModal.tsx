import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface AvatarPreviewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mediaUrl?: string;
  mediaType: 'video' | 'gif' | 'image';
}

export const AvatarPreviewModal = ({
  isOpen,
  onOpenChange,
  mediaUrl,
  mediaType,
}: AvatarPreviewModalProps) => {
  if (!mediaUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-transparent border-none">
        <VisuallyHidden>
          <DialogTitle>Profile Picture Preview</DialogTitle>
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
            alt="Profile Picture"
            className="w-full rounded-lg"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
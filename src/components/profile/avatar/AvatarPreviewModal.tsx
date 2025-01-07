import { Dialog, DialogContent } from "@/components/ui/dialog";

interface AvatarPreviewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mediaUrl: string;
  mediaType: 'video' | 'gif' | 'image';
}

export const AvatarPreviewModal = ({
  isOpen,
  onOpenChange,
  mediaUrl,
  mediaType,
}: AvatarPreviewModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-transparent border-none">
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
            alt="Profile"
            className="w-full rounded-lg"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
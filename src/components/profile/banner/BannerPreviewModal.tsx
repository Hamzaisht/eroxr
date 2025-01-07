import { Dialog, DialogContent } from "@/components/ui/dialog";

interface BannerPreviewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mediaUrl: string;
  mediaType: 'video' | 'gif' | 'image';
}

export const BannerPreviewModal = ({
  isOpen,
  onOpenChange,
  mediaUrl,
  mediaType,
}: BannerPreviewModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-7xl p-0 overflow-hidden bg-transparent border-none">
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
            alt="Banner"
            className="w-full rounded-lg"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
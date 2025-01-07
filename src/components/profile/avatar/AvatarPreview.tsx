import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface AvatarPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string;
  mediaType: 'video' | 'gif' | 'image';
}

export const AvatarPreview = ({ isOpen, onClose, mediaUrl, mediaType }: AvatarPreviewProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-transparent border-none">
        <DialogTitle className="sr-only">Profile Image Preview</DialogTitle>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-50"
        >
          <X className="h-5 w-5 text-white" />
        </button>
        {mediaType === 'video' ? (
          <video
            src={mediaUrl}
            className="w-full rounded-2xl"
            controls
            autoPlay
            loop
            playsInline
          />
        ) : (
          <img
            src={mediaUrl}
            alt="Profile"
            className="w-full rounded-2xl"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
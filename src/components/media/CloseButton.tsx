import { X } from "lucide-react";

interface CloseButtonProps {
  onClose: () => void;
}

export const CloseButton = ({ onClose }: CloseButtonProps) => {
  return (
    <button
      onClick={onClose}
      className="absolute right-4 top-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-50 cursor-pointer"
      aria-label="Close viewer"
    >
      <X className="h-6 w-6 text-white" />
    </button>
  );
};
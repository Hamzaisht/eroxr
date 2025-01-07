import { ChevronLeft, ChevronRight } from "lucide-react";

interface MediaControlsProps {
  showControls: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export const MediaControls = ({ showControls, onPrevious, onNext }: MediaControlsProps) => {
  if (!showControls) return null;
  
  return (
    <>
      <button
        onClick={onPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-50"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-50"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>
    </>
  );
};
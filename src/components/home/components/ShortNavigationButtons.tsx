
import { ChevronUp, ChevronDown } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-mobile";

interface ShortNavigationButtonsProps {
  currentVideoIndex: number;
  totalShorts: number;
  onNextClick: () => void;
  onPrevClick: () => void;
}

export const ShortNavigationButtons = ({
  currentVideoIndex,
  totalShorts,
  onNextClick,
  onPrevClick
}: ShortNavigationButtonsProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  if (isMobile) {
    return (
      <div className="fixed top-1/2 right-4 -translate-y-1/2 z-30 flex flex-col gap-2 items-center">
        <div className="text-white/70 text-xs bg-black/30 rounded-full px-2 py-1 backdrop-blur-sm">
          Swipe to navigate
        </div>
      </div>
    );
  }
  
  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-4">
      <button
        onClick={onPrevClick}
        className={`p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-colors
          ${currentVideoIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={currentVideoIndex === 0}
      >
        <ChevronUp className="w-6 h-6 text-white" />
      </button>
      
      <button
        onClick={onNextClick}
        className={`p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-colors
          ${currentVideoIndex === totalShorts - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={currentVideoIndex === totalShorts - 1}
      >
        <ChevronDown className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};

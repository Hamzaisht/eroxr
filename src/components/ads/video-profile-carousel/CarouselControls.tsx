
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  totalItems: number;
  currentIndex: number;
}

export const CarouselControls = ({
  onPrevious,
  onNext,
  totalItems,
  currentIndex
}: CarouselControlsProps) => {
  return (
    <>
      {/* Navigation arrows */}
      <button 
        onClick={onPrevious}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full hover:bg-black/60 transition-colors"
        aria-label="Previous item"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      
      <button 
        onClick={onNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full hover:bg-black/60 transition-colors"
        aria-label="Next item"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>
      
      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {Array.from({ length: totalItems }).map((_, index) => (
          <div 
            key={index}
            className={`w-2 h-2 rounded-full ${
              currentIndex === index ? 'bg-white' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </>
  );
};

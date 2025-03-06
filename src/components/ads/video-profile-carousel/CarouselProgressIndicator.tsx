
import { cn } from '@/lib/utils';

interface CarouselProgressIndicatorProps {
  totalSlides: number;
  currentIndex: number;
  onSlideChange: (index: number) => void;
}

export const CarouselProgressIndicator = ({ 
  totalSlides, 
  currentIndex, 
  onSlideChange 
}: CarouselProgressIndicatorProps) => {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
      {Array.from({ length: totalSlides }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSlideChange(index)}
          className={cn(
            "w-2 h-2 rounded-full transition-all duration-300",
            index === currentIndex 
              ? "bg-luxury-primary w-6" 
              : "bg-luxury-primary/30 hover:bg-luxury-primary/50"
          )}
        />
      ))}
    </div>
  );
};

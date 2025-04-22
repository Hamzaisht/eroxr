
import { motion } from 'framer-motion';
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
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2"
    >
      {Array.from({ length: totalSlides }).map((_, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onSlideChange(index)}
          className={cn(
            "h-2 rounded-full transition-all duration-300",
            index === currentIndex 
              ? "bg-luxury-primary w-6 animate-neon-glow" 
              : "bg-luxury-primary/30 hover:bg-luxury-primary/50 w-2"
          )}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </motion.div>
  );
};

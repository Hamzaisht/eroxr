
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CarouselNavigationProps {
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export const CarouselNavigation = ({ 
  onPrev, 
  onNext, 
  hasPrev, 
  hasNext 
}: CarouselNavigationProps) => {
  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onPrev}
        className={cn(
          "absolute left-6 z-20 p-4 rounded-full",
          "bg-luxury-dark/50 backdrop-blur-md border border-luxury-primary/20",
          "text-luxury-primary hover:text-white transition-colors",
          "hover:bg-luxury-primary/20 disabled:opacity-50 disabled:cursor-not-allowed",
          "group"
        )}
        disabled={!hasPrev}
      >
        <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onNext}
        className={cn(
          "absolute right-6 z-20 p-4 rounded-full",
          "bg-luxury-dark/50 backdrop-blur-md border border-luxury-primary/20",
          "text-luxury-primary hover:text-white transition-colors",
          "hover:bg-luxury-primary/20 disabled:opacity-50 disabled:cursor-not-allowed",
          "group"
        )}
        disabled={!hasNext}
      >
        <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
      </motion.button>
    </>
  );
};

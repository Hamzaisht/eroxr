
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavigationButtonsProps {
  currentIndex: number;
  totalStories: number;
  onNext: () => void;
  onPrevious: () => void;
}

export const NavigationButtons = ({
  currentIndex,
  totalStories,
  onNext,
  onPrevious,
}: NavigationButtonsProps) => {
  return (
    <AnimatePresence>
      {currentIndex > 0 && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          onClick={onPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors"
          aria-label="Previous story"
        >
          <ChevronLeft className="h-8 w-8" />
        </motion.button>
      )}
      {currentIndex < totalStories - 1 && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors"
          aria-label="Next story"
        >
          <ChevronRight className="h-8 w-8" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};


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
      <div className="absolute inset-y-0 left-0 right-0 z-[101] pointer-events-none">
        <div className="h-full flex items-center justify-between px-4">
          {currentIndex > 0 && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={onPrevious}
              className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white transition-colors pointer-events-auto"
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
              className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white transition-colors pointer-events-auto"
              aria-label="Next story"
            >
              <ChevronRight className="h-8 w-8" />
            </motion.button>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
};

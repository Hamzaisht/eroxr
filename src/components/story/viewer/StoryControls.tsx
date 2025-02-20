
import { motion } from "framer-motion";

interface StoryControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  onPause: () => void;
  onResume: () => void;
}

export const StoryControls = ({
  onPrevious,
  onNext,
  onPause,
  onResume
}: StoryControlsProps) => {
  return (
    <motion.div className="absolute inset-0 z-10">
      {/* Left side - Previous */}
      <div 
        className="absolute inset-y-0 left-0 w-1/3" 
        onClick={onPrevious}
        onTouchStart={onPause}
        onTouchEnd={onResume}
        onMouseDown={onPause}
        onMouseUp={onResume}
      />
      
      {/* Right side - Next */}
      <div 
        className="absolute inset-y-0 right-0 w-1/3"
        onClick={onNext}
        onTouchStart={onPause}
        onTouchEnd={onResume}
        onMouseDown={onPause}
        onMouseUp={onResume}
      />
    </motion.div>
  );
};

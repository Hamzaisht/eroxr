
import { motion } from "framer-motion";

interface StoryControlsProps {
  onClick: (e: React.MouseEvent) => void;
  onTouchStart: () => void;
  onTouchEnd: () => void;
  onMouseDown: () => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
}

export const StoryControls = ({
  onClick,
  onTouchStart,
  onTouchEnd,
  onMouseDown,
  onMouseUp,
  onMouseLeave
}: StoryControlsProps) => {
  return (
    <motion.div
      className="absolute inset-0 z-10"
      onClick={onClick}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      <div className="hidden md:flex absolute inset-y-0 left-0 w-1/3" />
      <div className="hidden md:flex absolute inset-y-0 right-0 w-1/3" />
    </motion.div>
  );
};

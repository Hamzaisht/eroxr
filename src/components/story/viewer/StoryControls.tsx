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
    <div 
      className="absolute inset-0 z-20"
      onClick={onClick}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      <motion.div
        initial={false}
        whileHover={{ 
          background: "linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.1) 100%)" 
        }}
        className="w-full h-full"
      />
    </div>
  );
};
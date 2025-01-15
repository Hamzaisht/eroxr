import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface StoryNavigationProps {
  onScroll: (direction: "left" | "right") => void;
}

export const StoryNavigation = ({ onScroll }: StoryNavigationProps) => {
  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10"
      >
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-luxury-dark/80 text-white hover:bg-luxury-dark hover:text-luxury-primary"
          onClick={() => onScroll("left")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
      >
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-luxury-dark/80 text-white hover:bg-luxury-dark hover:text-luxury-primary"
          onClick={() => onScroll("right")}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </motion.div>
    </>
  );
};
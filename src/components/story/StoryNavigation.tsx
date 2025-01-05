import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StoryNavigationProps {
  onScroll: (direction: "left" | "right") => void;
}

export const StoryNavigation = ({ onScroll }: StoryNavigationProps) => {
  return (
    <>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-luxury-dark/50 text-luxury-neutral hover:bg-luxury-dark/70"
          onClick={() => onScroll("left")}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-luxury-dark/50 text-luxury-neutral hover:bg-luxury-dark/70"
          onClick={() => onScroll("right")}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </>
  );
};
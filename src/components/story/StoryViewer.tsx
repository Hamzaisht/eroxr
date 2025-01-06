import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StoryViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stories: Array<{
    id: string;
    media_url: string;
  }>;
  creator: {
    id: string;
    username: string;
    avatar_url: string;
  };
}

export const StoryViewer = ({ open, onOpenChange, stories, creator }: StoryViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onOpenChange(false);
      setCurrentIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] p-0 bg-transparent border-none">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full"
          >
            <AspectRatio ratio={9/16} className="bg-black">
              {/* Story Header */}
              <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
                <Link to={`/profile/${creator.id}`} className="flex items-center gap-2">
                  <Avatar className="h-10 w-10 ring-2 ring-luxury-primary">
                    <AvatarImage src={creator.avatar_url} />
                    <AvatarFallback>
                      {creator.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-white font-medium">{creator.username}</span>
                </Link>
              </div>

              {/* Story Navigation */}
              <div className="absolute top-0 left-0 right-0 z-10 p-2">
                <div className="flex gap-1">
                  {stories.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 flex-1 rounded-full ${
                        index === currentIndex
                          ? "bg-luxury-primary"
                          : index < currentIndex
                          ? "bg-luxury-neutral/50"
                          : "bg-luxury-neutral/20"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Story Image */}
              <img
                src={stories[currentIndex].media_url}
                alt={`Story by ${creator.username}`}
                className="h-full w-full object-cover"
              />

              {/* Navigation Buttons */}
              {currentIndex > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-luxury-dark/50 text-luxury-neutral hover:bg-luxury-dark/70"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevious();
                  }}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              )}
              {currentIndex < stories.length - 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-luxury-dark/50 text-luxury-neutral hover:bg-luxury-dark/70"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              )}
            </AspectRatio>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
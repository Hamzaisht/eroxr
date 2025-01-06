import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useState } from "react";

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

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isRightSide = x > rect.width / 2;

    if (isRightSide) {
      if (currentIndex < stories.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        onOpenChange(false);
        setCurrentIndex(0);
      }
    } else {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] p-0 bg-transparent border-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full cursor-pointer"
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

              {/* Story Navigation Progress */}
              <div className="absolute top-0 left-0 right-0 z-10 p-2">
                <div className="flex gap-1">
                  {stories.map((_, index) => (
                    <div
                      key={index}
                      className="relative h-1 flex-1 bg-luxury-neutral/20 overflow-hidden rounded-full"
                    >
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ 
                          scaleX: index <= currentIndex ? 1 : 0,
                        }}
                        transition={{ 
                          duration: index === currentIndex ? 0.2 : 0,
                          ease: "easeInOut"
                        }}
                        className="absolute inset-0 bg-luxury-primary origin-left"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Story Area */}
              <div 
                className="absolute inset-0 z-20"
                onClick={handleClick}
              >
                <motion.div
                  initial={false}
                  whileHover={{ 
                    background: "linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.1) 100%)" 
                  }}
                  className="w-full h-full"
                />
              </div>

              {/* Story Image */}
              <motion.img
                key={stories[currentIndex].media_url}
                src={stories[currentIndex].media_url}
                alt={`Story by ${creator.username}`}
                className="h-full w-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </AspectRatio>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
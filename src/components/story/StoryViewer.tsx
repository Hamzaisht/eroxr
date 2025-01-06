import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface StoryViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  story: {
    id: string;
    media_url: string;
    creator: {
      id: string;
      username: string;
      avatar_url: string;
    };
  };
}

export const StoryViewer = ({ open, onOpenChange, story }: StoryViewerProps) => {
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
                <Link to={`/profile/${story.creator.id}`} className="flex items-center gap-2">
                  <Avatar className="h-10 w-10 ring-2 ring-luxury-primary">
                    <AvatarImage src={story.creator.avatar_url} />
                    <AvatarFallback>
                      {story.creator.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-white font-medium">{story.creator.username}</span>
                </Link>
              </div>

              {/* Story Image */}
              <img
                src={story.media_url}
                alt={`Story by ${story.creator.username}`}
                className="h-full w-full object-cover"
              />
            </AspectRatio>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
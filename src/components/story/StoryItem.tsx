import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { StoryViewer } from "./StoryViewer";

interface StoryItemProps {
  stories: Array<{
    id: string;
    media_url: string;
  }>;
  creator: {
    id: string;
    username: string;
    avatar_url: string;
  };
  index: number;
}

export const StoryItem = ({ stories, creator, index }: StoryItemProps) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
        className="flex-shrink-0"
        onClick={() => setIsViewerOpen(true)}
      >
        <div className="w-28 rounded-xl border border-luxury-neutral/10 bg-gradient-to-br from-luxury-dark/50 to-luxury-primary/5 p-2 cursor-pointer hover:bg-luxury-neutral/5 transition-all duration-300 group">
          <div className="relative mb-2">
            <Link 
              to={`/profile/${creator.id}`} 
              className="absolute -top-2 -left-2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-0.5 rounded-full bg-gradient-to-br from-luxury-primary to-luxury-secondary">
                <Avatar className="h-8 w-8 ring-2 ring-luxury-dark">
                  <AvatarImage src={creator.avatar_url} />
                  <AvatarFallback>
                    {creator.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </Link>
            <img 
              src={stories[0].media_url} 
              alt={`Story by ${creator.username}`}
              className="aspect-[3/4] rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="text-center">
            <p className="text-sm text-luxury-neutral truncate group-hover:text-luxury-primary transition-colors">
              {creator.username}
            </p>
          </div>
        </div>
      </motion.div>

      <StoryViewer
        open={isViewerOpen}
        onOpenChange={setIsViewerOpen}
        stories={stories}
        creator={creator}
      />
    </>
  );
};
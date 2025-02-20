
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Story } from "@/integrations/supabase/types/story";

interface StoryHeaderProps {
  story: Story;
  timeRemaining: string;
  onClose: () => void;
}

export const StoryHeader = ({ story, timeRemaining, onClose }: StoryHeaderProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4"
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 ring-2 ring-white/20">
          <AvatarImage src={story.creator.avatar_url} />
          <AvatarFallback>{story.creator.username[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-white font-medium">{story.creator.username}</span>
          <span className="text-xs text-white/70">{timeRemaining}</span>
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all"
      >
        <X className="h-5 w-5 text-white" />
      </button>
    </motion.div>
  );
};

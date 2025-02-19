
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StoryHeaderProps {
  creator: {
    username: string;
    avatar_url: string;
  };
  timeRemaining: string;
  onClose: () => void;
}

export const StoryHeader = ({ creator, timeRemaining, onClose }: StoryHeaderProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 ring-2 ring-white/20">
          <AvatarImage src={creator.avatar_url} />
          <AvatarFallback>{creator.username[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-white font-medium">{creator.username}</span>
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

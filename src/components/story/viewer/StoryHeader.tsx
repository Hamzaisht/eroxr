import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StoryHeaderProps {
  creator: {
    id: string;
    username: string;
    avatar_url: string;
  };
  timeRemaining: string;
}

export const StoryHeader = ({ creator, timeRemaining }: StoryHeaderProps) => {
  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent"
    >
      <div className="flex items-center justify-between">
        <Link to={`/profile/${creator.id}`} className="flex items-center gap-2">
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-luxury-primary to-luxury-accent opacity-75 blur-sm"
            />
            <Avatar className="h-10 w-10 ring-2 ring-luxury-primary relative z-10">
              <AvatarImage src={creator.avatar_url} />
              <AvatarFallback>
                {creator.username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-medium">{creator.username}</span>
            <span className="text-xs text-white/70">{timeRemaining}</span>
          </div>
        </Link>
      </div>
    </motion.div>
  );
};
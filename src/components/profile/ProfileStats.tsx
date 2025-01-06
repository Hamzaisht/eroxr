import { Users, Heart, Image } from "lucide-react";
import { motion } from "framer-motion";

export const ProfileStats = () => {
  return (
    <div className="absolute bottom-8 right-4 flex gap-4 z-30">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.05, y: -5 }}
        className="neo-blur rounded-2xl p-4 flex items-center gap-3 hover:bg-luxury-darker/60 transition-all duration-300"
      >
        <Users className="h-5 w-5 text-luxury-primary animate-pulse" />
        <div className="flex flex-col">
          <span className="text-white font-medium">4.3K</span>
          <span className="text-xs text-white/60">Followers</span>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.05, y: -5 }}
        className="neo-blur rounded-2xl p-4 flex items-center gap-3 hover:bg-luxury-darker/60 transition-all duration-300"
      >
        <Heart className="h-5 w-5 text-luxury-accent animate-pulse" />
        <div className="flex flex-col">
          <span className="text-white font-medium">12.8K</span>
          <span className="text-xs text-white/60">Likes</span>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.05, y: -5 }}
        className="neo-blur rounded-2xl p-4 flex items-center gap-3 hover:bg-luxury-darker/60 transition-all duration-300"
      >
        <Image className="h-5 w-5 text-luxury-neutral animate-pulse" />
        <div className="flex flex-col">
          <span className="text-white font-medium">286</span>
          <span className="text-xs text-white/60">Posts</span>
        </div>
      </motion.div>
    </div>
  );
};
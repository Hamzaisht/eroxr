import { Newspaper } from "lucide-react";
import { motion } from "framer-motion";
import { CreatorsFeed } from "../CreatorsFeed";

export const LeftSidebar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden lg:block space-y-4"
    >
      <div className="sticky top-4 space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-luxury-neutral/5 transition-colors">
          <Newspaper className="h-5 w-5 text-luxury-neutral" />
          <span className="font-medium">Your Feed</span>
        </div>
        <CreatorsFeed />
      </div>
    </motion.div>
  );
};
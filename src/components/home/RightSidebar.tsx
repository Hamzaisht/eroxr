import { motion } from "framer-motion";
import { SearchBar } from "./SearchBar";
import { SuggestedCreators } from "./SuggestedCreators";
import { TrendingTopics } from "./TrendingTopics";
import { UpcomingEvents } from "./UpcomingEvents";

export const RightSidebar = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6 sticky top-4 h-[calc(100vh-2rem)]"
    >
      <div className="rounded-xl border border-luxury-neutral/10 bg-luxury-dark/50 p-6 shadow-lg backdrop-blur-lg h-full overflow-hidden">
        <div className="flex flex-col h-full gap-6">
          <SearchBar />
          <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide">
            <SuggestedCreators />
            <TrendingTopics />
            <UpcomingEvents />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
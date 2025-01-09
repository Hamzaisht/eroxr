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
      className="space-y-6"
    >
      <SearchBar />
      <div className="space-y-6">
        <SuggestedCreators />
        <TrendingTopics />
        <UpcomingEvents />
      </div>
    </motion.div>
  );
};
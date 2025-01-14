import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

interface FeedHeaderProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const FeedHeader = ({ activeTab, onTabChange }: FeedHeaderProps) => {
  return (
    <Tabs value={activeTab} className="w-full" onValueChange={onTabChange}>
      <TabsList className="w-full justify-start mb-6 bg-transparent border-b border-luxury-neutral/10">
        <motion.div 
          className="flex space-x-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <TabsTrigger
            value="feed"
            className="data-[state=active]:bg-transparent data-[state=active]:text-luxury-primary relative"
          >
            Feed
            {activeTab === "feed" && (
              <motion.div
                className="absolute bottom-0 left-0 w-full h-0.5 bg-luxury-primary"
                layoutId="activeTab"
              />
            )}
          </TabsTrigger>
          <TabsTrigger
            value="trending"
            className="data-[state=active]:bg-transparent data-[state=active]:text-luxury-primary relative"
          >
            Trending
            {activeTab === "trending" && (
              <motion.div
                className="absolute bottom-0 left-0 w-full h-0.5 bg-luxury-primary"
                layoutId="activeTab"
              />
            )}
          </TabsTrigger>
          <TabsTrigger
            value="live"
            className="data-[state=active]:bg-transparent data-[state=active]:text-luxury-primary relative"
          >
            Live
            {activeTab === "live" && (
              <motion.div
                className="absolute bottom-0 left-0 w-full h-0.5 bg-luxury-primary"
                layoutId="activeTab"
              />
            )}
          </TabsTrigger>
        </motion.div>
      </TabsList>
    </Tabs>
  );
};
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

type TabValue = 'feed' | 'popular' | 'recent' | 'shorts';

interface FeedHeaderProps {
  activeTab: TabValue;
  onTabChange: (value: TabValue) => void;
}

export const FeedHeader = ({ activeTab, onTabChange }: FeedHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="w-full justify-start h-14 bg-transparent border-b border-luxury-primary/10 rounded-none p-0">
          <TabsTrigger 
            value="feed"
            className="relative data-[state=active]:bg-transparent data-[state=active]:text-luxury-primary rounded-none px-8 group h-14"
          >
            <span className="relative z-10">Feed</span>
            <motion.div
              className="absolute inset-0 bg-luxury-primary/10 rounded-lg"
              initial={false}
              animate={{
                opacity: activeTab === 'feed' ? 1 : 0,
                scale: activeTab === 'feed' ? 1 : 0.9
              }}
              transition={{ duration: 0.2 }}
            />
          </TabsTrigger>
          <TabsTrigger 
            value="popular"
            className="relative data-[state=active]:bg-transparent data-[state=active]:text-luxury-primary rounded-none px-8 group h-14"
          >
            <span className="relative z-10">Popular</span>
            <motion.div
              className="absolute inset-0 bg-luxury-primary/10 rounded-lg"
              initial={false}
              animate={{
                opacity: activeTab === 'popular' ? 1 : 0,
                scale: activeTab === 'popular' ? 1 : 0.9
              }}
              transition={{ duration: 0.2 }}
            />
          </TabsTrigger>
          <TabsTrigger 
            value="recent"
            className="relative data-[state=active]:bg-transparent data-[state=active]:text-luxury-primary rounded-none px-8 group h-14"
          >
            <span className="relative z-10">Recent</span>
            <motion.div
              className="absolute inset-0 bg-luxury-primary/10 rounded-lg"
              initial={false}
              animate={{
                opacity: activeTab === 'recent' ? 1 : 0,
                scale: activeTab === 'recent' ? 1 : 0.9
              }}
              transition={{ duration: 0.2 }}
            />
          </TabsTrigger>
          <TabsTrigger 
            value="shorts"
            className="relative data-[state=active]:bg-transparent data-[state=active]:text-luxury-primary rounded-none px-8 group h-14"
          >
            <span className="relative z-10">Eros</span>
            <motion.div
              className="absolute inset-0 bg-luxury-primary/10 rounded-lg"
              initial={false}
              animate={{
                opacity: activeTab === 'shorts' ? 1 : 0,
                scale: activeTab === 'shorts' ? 1 : 0.9
              }}
              transition={{ duration: 0.2 }}
            />
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
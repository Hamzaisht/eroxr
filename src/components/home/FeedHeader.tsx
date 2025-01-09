import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

type TabValue = 'feed' | 'popular' | 'recent' | 'shorts';

interface FeedHeaderProps {
  activeTab: TabValue;
  onTabChange: (value: TabValue) => void;
}

export const FeedHeader = ({ activeTab, onTabChange }: FeedHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="w-full justify-start h-14 bg-transparent border-b border-luxury-primary/5">
          <TabsTrigger 
            value="feed"
            className="feed-tab"
          >
            Feed
          </TabsTrigger>
          <TabsTrigger 
            value="popular"
            className="feed-tab"
          >
            Popular
          </TabsTrigger>
          <TabsTrigger 
            value="recent"
            className="feed-tab"
          >
            Recent
          </TabsTrigger>
          <TabsTrigger 
            value="shorts"
            className="feed-tab"
          >
            Eros
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
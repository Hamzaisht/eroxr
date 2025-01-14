import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FeedHeaderProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const FeedHeader = ({ activeTab, onTabChange }: FeedHeaderProps) => {
  return (
    <Tabs value={activeTab} className="w-full" onValueChange={onTabChange}>
      <TabsList className="w-full justify-start mb-6 bg-transparent border-b border-luxury-neutral/10">
        <TabsTrigger
          value="feed"
          className="data-[state=active]:bg-transparent data-[state=active]:text-luxury-primary"
        >
          Feed
        </TabsTrigger>
        <TabsTrigger
          value="trending"
          className="data-[state=active]:bg-transparent data-[state=active]:text-luxury-primary"
        >
          Trending
        </TabsTrigger>
        <TabsTrigger
          value="live"
          className="data-[state=active]:bg-transparent data-[state=active]:text-luxury-primary"
        >
          Live
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
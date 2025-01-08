import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FeedHeaderProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const FeedHeader = ({ activeTab, onTabChange }: FeedHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="w-full justify-start h-12 bg-transparent border-b rounded-none p-0">
          <TabsTrigger 
            value="feed"
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-luxury-primary rounded-none px-8"
          >
            Feed
          </TabsTrigger>
          <TabsTrigger 
            value="popular"
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-luxury-primary rounded-none px-8"
          >
            Popular
          </TabsTrigger>
          <TabsTrigger 
            value="recent"
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-luxury-primary rounded-none px-8"
          >
            Recent
          </TabsTrigger>
          <TabsTrigger 
            value="shorts"
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-luxury-primary rounded-none px-8"
          >
            Shorts
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
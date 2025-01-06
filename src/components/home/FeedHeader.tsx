import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const FeedHeader = () => {
  return (
    <div className="flex items-center justify-between mb-4">
      <Tabs defaultValue="feed" className="w-full">
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
        </TabsList>
      </Tabs>
    </div>
  );
};
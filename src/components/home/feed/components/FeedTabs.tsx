import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FeedHeader } from "../FeedHeader";
import { FeedContent } from "../FeedContent";
import { TrendingContent } from "../TrendingContent";
import { LiveStreams } from "../../LiveStreams";

interface FeedTabsProps {
  userId?: string;
  onOpenGoLive: () => void;
}

export const FeedTabs = ({ userId, onOpenGoLive }: FeedTabsProps) => {
  const [activeTab, setActiveTab] = useState("feed");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <FeedHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-6">
        <TabsContent value="feed" className="space-y-4 animate-fade-up">
          <FeedContent userId={userId} />
        </TabsContent>

        <TabsContent value="trending" className="space-y-4 animate-fade-up">
          <TrendingContent />
        </TabsContent>

        <TabsContent value="live" className="space-y-4 animate-fade-up">
          <LiveStreams onGoLive={onOpenGoLive} />
        </TabsContent>
      </div>
    </Tabs>
  );
};
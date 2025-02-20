
import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FeedHeader } from "../FeedHeader";
import { FeedContent } from "../FeedContent";
import { TrendingContent } from "../TrendingContent";
import { LiveStreams } from "../../LiveStreams";

interface FeedTabsProps {
  userId?: string;
  activeTab: string;
  onTabChange: (value: string) => void;
  onOpenCreatePost: () => void;
  onFileSelect: () => void;
  onOpenGoLive: () => void;
}

export const FeedTabs = ({ 
  userId, 
  activeTab, 
  onTabChange,
  onOpenCreatePost,
  onFileSelect,
  onOpenGoLive 
}: FeedTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <FeedHeader activeTab={activeTab} onTabChange={onTabChange} />

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

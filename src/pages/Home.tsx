
import { useState } from "react";
import { HomeLayout } from "@/components/home/HomeLayout";
import { FeedHeader } from "@/components/home/FeedHeader";
import { FeedContent } from "@/components/home/feed/FeedContent";
import { StoryReel } from "@/components/StoryReel";
import { CreatorsFeed } from "@/components/CreatorsFeed";

export type TabValue = 'feed' | 'popular' | 'recent' | 'shorts';

const Home = () => {
  const [activeTab, setActiveTab] = useState<TabValue>('feed');

  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return <FeedContent />;
      case 'popular':
        return <CreatorsFeed feedType="popular" />;
      case 'recent':
        return <CreatorsFeed feedType="recent" />;
      case 'shorts':
        return <CreatorsFeed feedType="feed" />;
      default:
        return <FeedContent />;
    }
  };

  return (
    <HomeLayout>
      <div className="space-y-6">
        {/* Stories Section */}
        <div className="w-full">
          <StoryReel />
        </div>
        
        {/* Feed Header with Tabs */}
        <FeedHeader 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
        {/* Dynamic Content Based on Active Tab */}
        <div className="w-full">
          {renderContent()}
        </div>
      </div>
    </HomeLayout>
  );
};

export default Home;

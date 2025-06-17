
import { useState } from "react";
import { HomeLayout } from "@/components/home/HomeLayout";
import { FeedHeader } from "@/components/home/FeedHeader";
import { FeedContent } from "@/components/home/feed/FeedContent";

export type TabValue = 'feed' | 'popular' | 'recent' | 'shorts';

const Home = () => {
  const [activeTab, setActiveTab] = useState<TabValue>('feed');

  return (
    <HomeLayout>
      <div className="space-y-6">
        <FeedHeader 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        <FeedContent />
      </div>
    </HomeLayout>
  );
};

export default Home;


import React from "react";
import { BarChart, Clock, FolderHeart, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TabNavigationProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ selectedTab, setSelectedTab }) => {
  return (
    <div className="flex overflow-x-auto pb-2 border-b border-white/10 gap-1">
      <Button
        variant={selectedTab === "overview" ? "secondary" : "ghost"}
        className={selectedTab === "overview" ? "bg-purple-900/20" : ""}
        onClick={() => setSelectedTab("overview")}
      >
        <BarChart className="mr-2 h-4 w-4" />
        Overview
      </Button>
      <Button
        variant={selectedTab === "activity" ? "secondary" : "ghost"}
        className={selectedTab === "activity" ? "bg-purple-900/20" : ""}
        onClick={() => setSelectedTab("activity")}
      >
        <Clock className="mr-2 h-4 w-4" />
        Activity Timeline
      </Button>
      <Button
        variant={selectedTab === "content" ? "secondary" : "ghost"}
        className={selectedTab === "content" ? "bg-purple-900/20" : ""}
        onClick={() => setSelectedTab("content")}
      >
        <FolderHeart className="mr-2 h-4 w-4" />
        Content Preferences
      </Button>
      <Button
        variant={selectedTab === "profiles" ? "secondary" : "ghost"}
        className={selectedTab === "profiles" ? "bg-purple-900/20" : ""}
        onClick={() => setSelectedTab("profiles")}
      >
        <UserCheck className="mr-2 h-4 w-4" />
        Most Viewed Profiles
      </Button>
    </div>
  );
};

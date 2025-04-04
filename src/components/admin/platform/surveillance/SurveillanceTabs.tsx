
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSurveillance } from "./SurveillanceContext";
import { TabContent } from "./TabContent";
import { AlertsList } from "./AlertsList";
import { LiveSession, SurveillanceTab } from "./types";
import { LiveAlert } from "@/types/alerts";
import { ContentSurveillanceTabs } from "./ContentSurveillanceTabs";
import { CreatorEarningsSurveillance } from "./CreatorEarningsSurveillance";
import { SessionList } from "./SessionList";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface SurveillanceTabsProps {
  liveAlerts: LiveAlert[];
  onSelectAlert?: (alert: LiveAlert) => void;
}

export const SurveillanceTabs = ({ liveAlerts, onSelectAlert }: SurveillanceTabsProps) => {
  const { 
    activeTab, 
    setActiveTab, 
    liveSessions, 
    isLoading,
    error,
    fetchLiveSessions
  } = useSurveillance();

  const { toast } = useToast();
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as SurveillanceTab);
  };

  // Fetch data when tab changes
  useEffect(() => {
    fetchLiveSessions();
  }, [activeTab, fetchLiveSessions]);
  
  // Handle monitoring a session
  const handleMonitorSession = async (session: LiveSession) => {
    try {
      toast({
        title: "Monitoring Session",
        description: `Now monitoring ${session.username || 'User'}'s activity`,
      });
      return true;
    } catch (error) {
      console.error("Error monitoring session:", error);
      toast({
        title: "Error",
        description: "Could not start monitoring session",
        variant: "destructive"
      });
      return false;
    }
  };
  
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={handleTabChange}
      className="w-full"
    >
      <TabsList className="mb-4 bg-[#161B22]/80 backdrop-blur-md">
        <TabsTrigger value="streams">Live Streams</TabsTrigger>
        <TabsTrigger value="calls">Active Calls</TabsTrigger>
        <TabsTrigger value="chats">Direct Messages</TabsTrigger>
        <TabsTrigger value="bodycontact">BodyContact</TabsTrigger>
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="earnings">Earnings</TabsTrigger>
        <TabsTrigger value="alerts" className="relative">
          Alerts
          {liveAlerts.length > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">
              {liveAlerts.length}
            </span>
          )}
        </TabsTrigger>
      </TabsList>
      
      {/* Live Session Tabs */}
      <TabsContent value="streams">
        <TabContent 
          isActive={activeTab === "streams"}
        >
          <SessionList
            sessions={liveSessions.filter(session => session.type === 'stream')}
            isLoading={isLoading}
            error={error}
            onMonitorSession={handleMonitorSession}
            actionInProgress={actionInProgress}
          />
        </TabContent>
      </TabsContent>
      
      <TabsContent value="calls">
        <TabContent 
          isActive={activeTab === "calls"}
        >
          <SessionList
            sessions={liveSessions.filter(session => session.type === 'call')}
            isLoading={isLoading}
            error={error}
            onMonitorSession={handleMonitorSession}
            actionInProgress={actionInProgress}
          />
        </TabContent>
      </TabsContent>
      
      <TabsContent value="chats">
        <TabContent 
          isActive={activeTab === "chats"}
        >
          <SessionList
            sessions={liveSessions.filter(session => session.type === 'chat')}
            isLoading={isLoading}
            error={error}
            onMonitorSession={handleMonitorSession}
            actionInProgress={actionInProgress}
          />
        </TabContent>
      </TabsContent>
      
      <TabsContent value="bodycontact">
        <TabContent 
          isActive={activeTab === "bodycontact"}
        >
          <SessionList
            sessions={liveSessions.filter(session => session.type === 'bodycontact')}
            isLoading={isLoading}
            error={error}
            onMonitorSession={handleMonitorSession}
            actionInProgress={actionInProgress}
          />
        </TabContent>
      </TabsContent>
      
      {/* Content Surveillance Tab */}
      <TabsContent value="content">
        <ContentSurveillanceTabs />
      </TabsContent>
      
      {/* Earnings Surveillance Tab */}
      <TabsContent value="earnings">
        <CreatorEarningsSurveillance />
      </TabsContent>
      
      <TabsContent value="alerts">
        <AlertsList 
          alerts={liveAlerts} 
          isLoading={isLoading} 
          onSelect={onSelectAlert}
        />
      </TabsContent>
    </Tabs>
  );
};

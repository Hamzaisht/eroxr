
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useSurveillance } from "./SurveillanceContext";
import { AlertsList } from "./AlertsList";
import { LiveAlert } from "@/types/surveillance";
import { ContentSurveillanceTabs } from "./ContentSurveillanceTabs";
import { CreatorEarningsSurveillance } from "./CreatorEarningsSurveillance";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSurveillanceData } from "./hooks/useSurveillanceData";
import { SurveillanceTabsList } from "./components/SurveillanceTabsList";
import { SessionTabContent } from "./components/SessionTabContent";
import { LiveSession, SurveillanceTab } from "@/types/surveillance";

interface SurveillanceTabsProps {
  liveAlerts: LiveAlert[];
  onSelectAlert?: (alert: LiveAlert) => void;
}

export const SurveillanceTabs = ({ liveAlerts, onSelectAlert }: SurveillanceTabsProps) => {
  const { 
    activeTab, 
    setActiveTab, 
    error: contextError,
  } = useSurveillance();
  
  const { 
    liveSessions, 
    isLoading, 
    error: dataError, 
    refreshData 
  } = useSurveillanceData();

  const { toast } = useToast();
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as SurveillanceTab);
  };
  
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
  
  // Filter sessions based on the active tab
  const getFilteredSessions = () => {
    if (!liveSessions || liveSessions.length === 0) return [];
    
    switch (activeTab) {
      case SurveillanceTab.STREAMS:
        return liveSessions.filter(session => session.type === 'stream');
      case SurveillanceTab.CALLS:
        return liveSessions.filter(session => session.type === 'call');
      case SurveillanceTab.CHATS:
        return liveSessions.filter(session => session.type === 'chat');
      case SurveillanceTab.BODYCONTACT:
        return liveSessions.filter(session => session.type === 'bodycontact');
      default:
        return liveSessions;
    }
  };
  
  const filteredSessions = getFilteredSessions();
  const error = contextError || dataError;
  
  // Handle manual refresh
  const handleManualRefresh = () => {
    refreshData();
    toast({
      title: "Refreshed",
      description: "Surveillance data has been updated"
    });
  };
  
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={handleTabChange}
      className="w-full"
    >
      <SurveillanceTabsList
        liveAlerts={liveAlerts}
        activeTab={activeTab}
      />
      
      {/* Live Session Tabs */}
      <SessionTabContent 
        value={SurveillanceTab.STREAMS}
        activeTab={activeTab}
        sessions={filteredSessions}
        isLoading={isLoading}
        error={error}
        onMonitorSession={handleMonitorSession}
        actionInProgress={actionInProgress}
        onRefresh={handleManualRefresh}
      />
      
      <SessionTabContent 
        value={SurveillanceTab.CALLS}
        activeTab={activeTab}
        sessions={filteredSessions}
        isLoading={isLoading}
        error={error}
        onMonitorSession={handleMonitorSession}
        actionInProgress={actionInProgress}
        onRefresh={handleManualRefresh}
      />
      
      <SessionTabContent 
        value={SurveillanceTab.CHATS}
        activeTab={activeTab}
        sessions={filteredSessions}
        isLoading={isLoading}
        error={error}
        onMonitorSession={handleMonitorSession}
        actionInProgress={actionInProgress}
        onRefresh={handleManualRefresh}
      />
      
      <SessionTabContent 
        value={SurveillanceTab.BODYCONTACT}
        activeTab={activeTab}
        sessions={filteredSessions}
        isLoading={isLoading}
        error={error}
        onMonitorSession={handleMonitorSession}
        actionInProgress={actionInProgress}
        onRefresh={handleManualRefresh}
      />
      
      {/* Content Surveillance Tab */}
      <TabsContent value={SurveillanceTab.CONTENT}>
        <ContentSurveillanceTabs />
      </TabsContent>
      
      {/* Earnings Surveillance Tab */}
      <TabsContent value={SurveillanceTab.EARNINGS}>
        <CreatorEarningsSurveillance />
      </TabsContent>
      
      <TabsContent value={SurveillanceTab.ALERTS}>
        <AlertsList 
          alerts={liveAlerts} 
          isLoading={isLoading} 
          onSelect={onSelectAlert}
        />
      </TabsContent>
    </Tabs>
  );
};

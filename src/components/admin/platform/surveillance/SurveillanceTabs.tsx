
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSurveillance } from "./SurveillanceContext";
import { TabContent } from "./TabContent";
import { AlertsList } from "./AlertsList";
import { LiveAlert } from "../user-analytics/types";

interface SurveillanceTabsProps {
  liveAlerts: LiveAlert[];
}

export const SurveillanceTabs = ({ liveAlerts }: SurveillanceTabsProps) => {
  const { 
    activeTab, 
    setActiveTab, 
    liveSessions, 
    isLoading,
    error
  } = useSurveillance();
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as any);
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
        <TabsTrigger value="alerts" className="relative">
          Alerts
          {liveAlerts.length > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">
              {liveAlerts.length}
            </span>
          )}
        </TabsTrigger>
      </TabsList>
      
      {/* Add activeTab prop to each TabContent */}
      <TabsContent value="streams">
        <TabContent 
          sessions={liveSessions}
          isLoading={isLoading}
          error={error}
          activeTab="streams"
        />
      </TabsContent>
      
      <TabsContent value="calls">
        <TabContent 
          sessions={liveSessions}
          isLoading={isLoading}
          error={error}
          activeTab="calls"
        />
      </TabsContent>
      
      <TabsContent value="chats">
        <TabContent 
          sessions={liveSessions}
          isLoading={isLoading}
          error={error}
          activeTab="chats"
        />
      </TabsContent>
      
      <TabsContent value="bodycontact">
        <TabContent 
          sessions={liveSessions}
          isLoading={isLoading}
          error={error}
          activeTab="bodycontact"
        />
      </TabsContent>
      
      <TabsContent value="alerts">
        <AlertsList 
          alerts={liveAlerts} 
          isLoading={isLoading} 
        />
      </TabsContent>
    </Tabs>
  );
};

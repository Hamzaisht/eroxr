
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSurveillance } from "./SurveillanceContext";
import { TabContent } from "./TabContent";
import { AlertsList } from "./AlertsList";
import { LiveSession, SurveillanceTab } from "./types";
import { LiveAlert } from "@/types/alerts";
import { ContentSurveillanceTabs } from "./ContentSurveillanceTabs";
import { CreatorEarningsSurveillance } from "./CreatorEarningsSurveillance";

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
    error
  } = useSurveillance();
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as SurveillanceTab);
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
          <div className="content-wrapper">
            {/* Add your streams content here */}
            <p>Streams content will go here</p>
          </div>
        </TabContent>
      </TabsContent>
      
      <TabsContent value="calls">
        <TabContent 
          isActive={activeTab === "calls"}
        >
          <div className="content-wrapper">
            {/* Add your calls content here */}
            <p>Calls content will go here</p>
          </div>
        </TabContent>
      </TabsContent>
      
      <TabsContent value="chats">
        <TabContent 
          isActive={activeTab === "chats"}
        >
          <div className="content-wrapper">
            {/* Add your chats content here */}
            <p>Chats content will go here</p>
          </div>
        </TabContent>
      </TabsContent>
      
      <TabsContent value="bodycontact">
        <TabContent 
          isActive={activeTab === "bodycontact"}
        >
          <div className="content-wrapper">
            {/* Add your bodycontact content here */}
            <p>Bodycontact content will go here</p>
          </div>
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

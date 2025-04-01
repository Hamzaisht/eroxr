
import { useSurveillance } from "./SurveillanceContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabContent } from "./TabContent";
import { Badge } from "@/components/ui/badge";
import { LiveAlert } from "../user-analytics/types";
import { Webcam, Phone, MessageSquare, User, AlertTriangle } from "lucide-react";

interface SurveillanceTabsProps {
  liveAlerts: LiveAlert[];
}

export const SurveillanceTabs = ({ liveAlerts }: SurveillanceTabsProps) => {
  const { 
    activeTab, 
    setActiveTab, 
    liveSessions, 
    isLoading,
    handleStartSurveillance 
  } = useSurveillance();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-5 mb-4">
        <TabsTrigger value="streams" className="flex items-center gap-2">
          <Webcam className="h-4 w-4" />
          <span className="hidden md:inline">Live Streams</span>
        </TabsTrigger>
        <TabsTrigger value="calls" className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          <span className="hidden md:inline">Active Calls</span>
        </TabsTrigger>
        <TabsTrigger value="chats" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          <span className="hidden md:inline">Live Chats</span>
        </TabsTrigger>
        <TabsTrigger value="bodycontact" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="hidden md:inline">BodyContact</span>
        </TabsTrigger>
        <TabsTrigger value="alerts" className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span className="hidden md:inline">Live Alerts</span>
          {liveAlerts.length > 0 && (
            <Badge className="ml-2 bg-red-600">{liveAlerts.length}</Badge>
          )}
        </TabsTrigger>
      </TabsList>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TabContent
          activeTab={activeTab}
          isLoading={isLoading}
          liveSessions={liveSessions}
          liveAlerts={liveAlerts}
          onMonitorSession={handleStartSurveillance}
        />
      </div>
    </Tabs>
  );
};

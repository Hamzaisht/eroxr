
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LiveAlert } from "@/types/alerts";
import { SurveillanceTab } from "@/types/surveillance";

interface SurveillanceTabsListProps {
  liveAlerts: LiveAlert[];
  activeTab: SurveillanceTab;
}

export const SurveillanceTabsList = ({ liveAlerts, activeTab }: SurveillanceTabsListProps) => {
  // Count alerts by type
  const getAlertCount = (type: string) => {
    return liveAlerts.filter(alert => alert.type === type && !alert.isRead).length;
  };
  
  // Get critical alerts count
  const getCriticalAlertCount = () => {
    return liveAlerts.filter(alert => 
      alert.severity === 'critical' && !alert.isRead
    ).length;
  };
  
  return (
    <TabsList className="mb-6 w-full justify-start overflow-x-auto">
      <TabsTrigger value="streams" className="relative">
        Streams
      </TabsTrigger>
      <TabsTrigger value="calls" className="relative">
        Calls
      </TabsTrigger>
      <TabsTrigger value="chats" className="relative">
        Chats
      </TabsTrigger>
      <TabsTrigger value="bodycontact" className="relative">
        Body Contact
      </TabsTrigger>
      <TabsTrigger value="content" className="relative">
        Content
        {getAlertCount('content') > 0 && (
          <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
            {getAlertCount('content')}
          </Badge>
        )}
      </TabsTrigger>
      <TabsTrigger value="earnings" className="relative">
        Earnings
      </TabsTrigger>
      <TabsTrigger value="alerts" className="relative">
        Alerts
        {getCriticalAlertCount() > 0 && (
          <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
            {getCriticalAlertCount()}
          </Badge>
        )}
      </TabsTrigger>
    </TabsList>
  );
};

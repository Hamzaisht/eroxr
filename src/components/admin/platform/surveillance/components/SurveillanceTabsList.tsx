
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SurveillanceTab } from "@/types/surveillance";
import { LiveAlert } from "@/types/alerts";

interface SurveillanceTabsListProps {
  liveAlerts: LiveAlert[];
  activeTab: SurveillanceTab;
}

export const SurveillanceTabsList = ({ liveAlerts, activeTab }: SurveillanceTabsListProps) => {
  return (
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
  );
};

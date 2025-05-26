
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LiveSurveillance } from "@/components/admin/platform/LiveSurveillance";
import { useLiveSurveillanceData } from "@/hooks/useGhostMode";
import React from "react";

interface AdminDashboardTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children?: React.ReactNode;
}

export const AdminDashboardTabs: React.FC<AdminDashboardTabsProps> = ({ 
  activeTab, 
  onTabChange,
  children
}) => {
  const { sessions, isLoading, error } = useLiveSurveillanceData();
  
  const handleMonitorSession = async (session: any) => {
    console.log("Monitoring session:", session);
    return true;
  };
  
  const handleRefresh = async () => {
    console.log("Refreshing surveillance data");
    return true;
  };
  
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="bg-[#0F141A]">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="surveillance">Surveillance</TabsTrigger>
        <TabsTrigger value="users">User Management</TabsTrigger>
        <TabsTrigger value="content">Content Moderation</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      
      <TabsContent value="surveillance">
        <LiveSurveillance 
          sessions={sessions}
          isLoading={isLoading}
          error={error}
          onMonitorSession={handleMonitorSession}
          actionInProgress=""
          onRefresh={handleRefresh}
        />
      </TabsContent>
      
      {children}
    </Tabs>
  );
};

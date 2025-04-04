
import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LiveSurveillance } from "@/components/admin/platform/LiveSurveillance";

interface AdminDashboardTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children?: ReactNode;
}

export const AdminDashboardTabs = ({ activeTab, onTabChange, children }: AdminDashboardTabsProps) => {
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
        <LiveSurveillance />
      </TabsContent>
      
      {/* Render optional children */}
      {children}
    </Tabs>
  );
};

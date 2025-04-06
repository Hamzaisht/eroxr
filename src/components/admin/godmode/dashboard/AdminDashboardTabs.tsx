
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LiveSurveillance } from "@/components/admin/platform/LiveSurveillance";
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
  return (
    <>
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
      
      {children}
    </>
  );
};

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LiveSurveillance } from "@/components/admin/platform/LiveSurveillance";

interface AdminDashboardTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children?: React.ReactNode; // Already added children prop
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
      
      <TabsContent value="overview">
        <div className="rounded-md border border-[#2A2A3D] p-4 bg-[#131520]">
          <h2 className="text-xl mb-4">Admin Overview</h2>
          <p>This is the admin dashboard overview.</p>
          {activeTab === "overview" && children}
        </div>
      </TabsContent>
      
      <TabsContent value="surveillance">
        <LiveSurveillance />
        {activeTab === "surveillance" && children}
      </TabsContent>
      
      <TabsContent value="users">
        <div className="rounded-md border border-[#2A2A3D] p-4 bg-[#131520]">
          <h2 className="text-xl mb-4">User Management</h2>
          <p>Manage users here.</p>
          {activeTab === "users" && children}
        </div>
      </TabsContent>
      
      <TabsContent value="content">
        <div className="rounded-md border border-[#2A2A3D] p-4 bg-[#131520]">
          <h2 className="text-xl mb-4">Content Moderation</h2>
          <p>Moderate content here.</p>
          {activeTab === "content" && children}
        </div>
      </TabsContent>
      
      <TabsContent value="settings">
        <div className="rounded-md border border-[#2A2A3D] p-4 bg-[#131520]">
          <h2 className="text-xl mb-4">Admin Settings</h2>
          <p>Configure admin settings here.</p>
          {activeTab === "settings" && children}
        </div>
      </TabsContent>
    </Tabs>
  );
};

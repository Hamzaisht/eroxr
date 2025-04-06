
import { useState, useEffect } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useGhostMode } from "@/hooks/useGhostMode";
import { AdminDashboardTabs } from "@/components/admin/godmode/dashboard/AdminDashboardTabs";
import { useAlertProcessor } from "@/components/admin/godmode/dashboard/AlertProcessor";
import { TabsContent } from "@/components/ui/tabs";

export default function GodmodeDashboard() {
  const session = useSession();
  const { isGhostMode, setIsGhostMode } = useGhostMode();
  const [activeTab, setActiveTab] = useState("overview");
  const [isAdminLoaded, setIsAdminLoaded] = useState(false);
  const { alerts } = useAlertProcessor();

  // Check admin status
  useEffect(() => {
    if (!session?.user?.id) return;

    const checkAdminStatus = async () => {
      const { data: adminCheck } = await supabase
        .from("admin_users")
        .select("is_admin")
        .eq("user_id", session.user.id)
        .single();

      const isAdmin = !!adminCheck?.is_admin;
      
      if (isAdmin) {
        setIsAdminLoaded(true);
        
        // Enable ghost mode for testing in development
        if (import.meta.env.MODE === 'development') {
          console.log("Development mode: Auto-enabling ghost mode for testing");
          setIsGhostMode(true);
        }
      }
    };

    checkAdminStatus();
  }, [session, setIsGhostMode]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Handle click on an alert
  const handleAlertClick = (alert: any) => {
    const username = alert.username || 'Unknown';
    console.log(`Viewing alert for ${username}: ${alert.reason}`);
  };

  // If admin status hasn't been checked yet, show loading
  if (!session || !isAdminLoaded) {
    return <div>Loading admin dashboard...</div>;
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-6 space-y-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        
        <AdminDashboardTabs 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
        >
          <TabsContent value="overview">
            <div className="rounded-md border border-[#2A2A3D] p-4 bg-[#131520]">
              <h2 className="text-xl mb-4">Admin Overview</h2>
              <p>This is the admin dashboard overview.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <div className="rounded-md border border-[#2A2A3D] p-4 bg-[#131520]">
              <h2 className="text-xl mb-4">User Management</h2>
              <p>Manage users here.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="content">
            <div className="rounded-md border border-[#2A2A3D] p-4 bg-[#131520]">
              <h2 className="text-xl mb-4">Content Moderation</h2>
              <p>Moderate content here.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="rounded-md border border-[#2A2A3D] p-4 bg-[#131520]">
              <h2 className="text-xl mb-4">Admin Settings</h2>
              <p>Configure admin settings here.</p>
            </div>
          </TabsContent>
        </AdminDashboardTabs>
      </div>
    </AdminLayout>
  );
}

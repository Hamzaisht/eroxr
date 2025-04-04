
import { useState, useEffect } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { useSession } from "@supabase/auth-helpers-react";
import { LiveAlert } from "@/types/alerts";
import { supabase } from "@/integrations/supabase/client";
import { LiveSurveillance } from "@/components/admin/platform/LiveSurveillance";
import { useGhostMode } from "@/hooks/useGhostMode";
import { formatFlaggedContentAsAlert, formatReportAsAlert } from "@/context/ghost/utils/alertFormatters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock alerts for development/testing purposes
const mockAlerts: Omit<LiveAlert, "alert_type">[] = [
  {
    id: "1",
    type: "violation",
    user_id: "user-123",
    username: "suspicious_user",
    avatar_url: "https://i.pravatar.cc/150?u=1",
    timestamp: new Date().toISOString(),
    created_at: new Date().toISOString(),
    content_type: "post",
    reason: "Inappropriate content",
    severity: "high",
    content_id: "post-456",
    message: "This post contains inappropriate images",
    status: "pending",
    title: "Content Violation",
    description: "Post with inappropriate content detected",
    is_viewed: false,
    urgent: true
  },
  {
    id: "2",
    type: "risk",
    user_id: "user-234",
    username: "potential_bot",
    avatar_url: "https://i.pravatar.cc/150?u=2",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
    content_type: "message",
    reason: "Spam behavior",
    severity: "medium",
    content_id: "message-789",
    message: "User sending identical messages to multiple profiles",
    status: "investigating",
    title: "Potential Spam",
    description: "Multiple identical messages sent in short timeframe",
    is_viewed: false,
    urgent: false
  },
];

// Helper to map from raw alerts to typed alerts
const mapToLiveAlerts = (alerts: Omit<LiveAlert, "alert_type">[]): LiveAlert[] => {
  return alerts.map(alert => {
    let alert_type: "violation" | "risk" | "information" = "information";
    
    if (alert.type === "violation") {
      alert_type = "violation";
    } else if (alert.type === "risk") {
      alert_type = "risk";
    }
    
    return {
      ...alert,
      alert_type
    };
  });
};

export default function GodmodeDashboard() {
  const session = useSession();
  const { isGhostMode, setIsGhostMode } = useGhostMode();
  const [alerts, setAlerts] = useState<LiveAlert[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [isAdminLoaded, setIsAdminLoaded] = useState(false);

  // Fetch dashboard data
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
        
        // Enable ghost mode for testing
        if (import.meta.env.MODE === 'development') {
          console.log("Development mode: Auto-enabling ghost mode for testing");
          setIsGhostMode(true);
        }
        
        // In production, fetch real alerts
        if (import.meta.env.MODE === 'production') {
          fetchRealAlerts();
        } else {
          // In development, use mock data
          setAlerts(mapToLiveAlerts(mockAlerts));
        }
      }
    };

    checkAdminStatus();
  }, [session, setIsGhostMode]);

  // Fetch real alerts from Supabase
  const fetchRealAlerts = async () => {
    try {
      // Fetch flagged content
      const { data: flaggedContent } = await supabase
        .from('flagged_content')
        .select('*, user:user_id(username, avatar_url)')
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch user reports
      const { data: reports } = await supabase
        .from('reports')
        .select('*, reporter:reporter_id(username, avatar_url), reported:reported_id(username, avatar_url)')
        .order('created_at', { ascending: false })
        .limit(10);

      // Format alerts
      const formattedAlerts: LiveAlert[] = [
        ...(flaggedContent || []).map((content: any) => ({
          ...formatFlaggedContentAsAlert(content),
          alert_type: 'risk' as 'violation' | 'risk' | 'information'
        })),
        ...(reports || []).map((report: any) => ({
          ...formatReportAsAlert(report),
          alert_type: 'violation' as 'violation' | 'risk' | 'information'
        }))
      ];

      // Sort by severity
      formattedAlerts.sort((a, b) => {
        const severityRank = { high: 0, medium: 1, low: 2 };
        return severityRank[a.severity] - severityRank[b.severity];
      });

      setAlerts(formattedAlerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Handle click on an alert
  const handleAlertClick = (alert: LiveAlert) => {
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
        
        <Tabs value={activeTab} onValueChange={handleTabChange}>
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
            </div>
          </TabsContent>
          
          <TabsContent value="surveillance">
            <LiveSurveillance />
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
        </Tabs>
      </div>
    </AdminLayout>
  );
}


import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { GodmodeLayout } from "@/components/admin/godmode/GodmodeLayout";
import { GodmodeDashboardHome } from "@/components/admin/godmode/GodmodeDashboardHome";
import { AdminLogs } from "@/components/admin/godmode/AdminLogs";
import { ContentFeed } from "@/pages/admin/godmode/ContentFeed";
import { Surveillance } from "@/pages/admin/godmode/Surveillance";
import { Moderation } from "@/pages/admin/godmode/Moderation";
import { Payouts } from "@/pages/admin/godmode/Payouts";
import { PlatformControl } from "@/pages/admin/godmode/PlatformControl";
import { Verification } from "@/pages/admin/godmode/Verification";
import { useToast } from "@/hooks/use-toast";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";
import { NotAuthorized } from "@/components/admin/NotAuthorized";

const GodmodeDashboard = () => {
  const { toast } = useToast();
  const { isAdmin, loading } = useSuperAdminCheck();

  useEffect(() => {
    if (!loading && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this area.",
        variant: "destructive",
      });
    }
  }, [isAdmin, loading, toast]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-luxury-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-luxury-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <NotAuthorized />;
  }

  return (
    <Routes>
      <Route element={<GodmodeLayout />}>
        <Route index element={<GodmodeDashboardHome />} />
        <Route path="logs" element={<AdminLogs />} />
        <Route path="content-feed" element={<ContentFeed />} />
        <Route path="surveillance" element={<Surveillance />} />
        <Route path="moderation" element={<Moderation />} />
        <Route path="payouts" element={<Payouts />} />
        <Route path="platform" element={<PlatformControl />} />
        <Route path="verification" element={<Verification />} />
      </Route>
    </Routes>
  );
};

export default GodmodeDashboard;

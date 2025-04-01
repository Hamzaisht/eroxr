
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserAnalytics } from "./user-analytics/useUserAnalytics";
import { LoadingState } from "@/components/ui/LoadingState";
import { UserHeader } from "./user-analytics/UserHeader";
import { TabNavigation } from "./user-analytics/TabNavigation";
import { EmptyState } from "./user-analytics/EmptyState";
import { NotFoundState } from "./user-analytics/NotFoundState";
import { OverviewTab } from "./user-analytics/OverviewTab";
import { ActivityTimelineTab } from "./user-analytics/ActivityTimelineTab";
import { ContentPreferencesTab } from "./user-analytics/ContentPreferencesTab";
import { ProfilesViewsTab } from "./user-analytics/ProfilesViewsTab";

export const UserAnalytics = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("30"); // Default 30 days
  const [selectedTab, setSelectedTab] = useState("overview");

  const { profile, analytics, isLoading } = useUserAnalytics(userId, timeRange);

  if (!userId) {
    return <EmptyState onNavigateToUsers={() => navigate("/admin/platform/users")} />;
  }

  if (isLoading) {
    return <LoadingState message="Loading user analytics..." />;
  }

  if (!profile || !analytics) {
    return <NotFoundState onNavigateToUsers={() => navigate("/admin/platform/users")} />;
  }

  return (
    <div className="space-y-6">
      {/* User profile header */}
      <UserHeader 
        profile={profile} 
        timeRange={timeRange} 
        setTimeRange={setTimeRange} 
        onNavigateBack={() => navigate("/admin/platform/users")} 
      />
      
      {/* Analytics tabs */}
      <TabNavigation selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      
      {/* Tab content */}
      {selectedTab === "overview" && <OverviewTab analytics={analytics} timeRange={timeRange} />}
      
      {selectedTab === "activity" && <ActivityTimelineTab analytics={analytics} timeRange={timeRange} />}
      
      {selectedTab === "content" && <ContentPreferencesTab analytics={analytics} timeRange={timeRange} />}
      
      {selectedTab === "profiles" && <ProfilesViewsTab analytics={analytics} timeRange={timeRange} navigate={navigate} />}
    </div>
  );
};

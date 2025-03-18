
import { Loader2 } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { PayoutSection } from "@/components/dashboard/PayoutSection";
import { useEroboardData } from "@/hooks/useEroboardData";
import { useState } from "react";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";

export default function Eroboard() {
  const {
    loading,
    stats,
    engagementData,
    contentTypeData,
    earningsData,
    latestPayout,
    fetchDashboardData,
    setLatestPayout
  } = useEroboardData();

  const [payoutDialogOpen, setPayoutDialogOpen] = useState(false);

  // Set up realtime updates for relevant tables
  useRealtimeUpdates('post_purchases');
  useRealtimeUpdates('creator_subscriptions');
  useRealtimeUpdates('payout_requests');

  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    fetchDashboardData(range);
  };

  const handlePayoutSuccess = () => {
    fetchDashboardData();
  };

  const isPayoutDisabled = () => {
    return latestPayout?.status === 'pending' || stats.totalEarnings < 100;
  };

  const getPayoutButtonTooltip = () => {
    if (latestPayout?.status === 'pending') return 'You have a pending payout request';
    if (stats.totalEarnings < 100) return 'Minimum payout amount is $100';
    return '';
  };

  const getPayoutStatusText = () => {
    if (!latestPayout) return null;

    switch (latestPayout.status) {
      case 'pending':
        return '(Under Review)';
      case 'approved':
        return '(Approved)';
      case 'processed':
        return `(Last Payment: ${new Date(latestPayout.processed_at!).toLocaleDateString()})`;
      default:
        return null;
    }
  };

  if (loading) {
    return <LoadingState message="Loading your dashboard data..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-luxury-dark via-luxury-darker to-luxury-dark">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader 
          totalEarnings={stats.totalEarnings}
          onRequestPayout={() => setPayoutDialogOpen(true)}
          isPayoutDisabled={isPayoutDisabled()}
          payoutStatus={getPayoutStatusText()}
          payoutTooltip={getPayoutButtonTooltip()}
        />
        
        <StatsCards stats={stats} />
        
        <DashboardCharts
          engagementData={engagementData}
          contentTypeData={contentTypeData}
          earningsData={earningsData}
          onDateRangeChange={handleDateRangeChange}
        />

        <PayoutSection 
          totalEarnings={stats.totalEarnings}
          latestPayout={latestPayout}
          onPayoutSuccess={handlePayoutSuccess}
          payoutDialogOpen={payoutDialogOpen}
          setPayoutDialogOpen={setPayoutDialogOpen}
        />
      </div>
    </div>
  );
}

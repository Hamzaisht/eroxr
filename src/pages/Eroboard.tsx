
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { PayoutSection } from "@/components/dashboard/PayoutSection";
import { useEroboardData } from "@/hooks/useEroboardData";
import { useState } from "react";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RevenueBreakdownChart } from "@/components/dashboard/RevenueBreakdownChart";
import { AdvancedMetricsCard } from "@/components/dashboard/AdvancedMetricsCard";
import { ContentPerformanceHeatmap } from "@/components/dashboard/ContentPerformanceHeatmap";

export default function Eroboard() {
  const {
    loading,
    error,
    stats,
    revenueBreakdown,
    engagementData,
    contentTypeData,
    earningsData,
    contentPerformanceData,
    latestPayout,
    fetchDashboardData,
    setLatestPayout
  } = useEroboardData();

  const [payoutDialogOpen, setPayoutDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Set up realtime updates for relevant tables
  useRealtimeUpdates('post_purchases');
  useRealtimeUpdates('creator_subscriptions');
  useRealtimeUpdates('payout_requests');
  useRealtimeUpdates('posts');
  useRealtimeUpdates('post_likes');
  useRealtimeUpdates('post_comments');

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
        
        {error && (
          <Alert className="mb-6 bg-red-500/10 border-red-500/30">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-100">
              {error} - Please try refreshing the page.
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-luxury-darker/50 backdrop-blur-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <StatsCards stats={stats} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-8">
              <RevenueBreakdownChart data={revenueBreakdown} />
              <AdvancedMetricsCard 
                totalSubscribers={stats.totalSubscribers}
                newSubscribers={stats.newSubscribers}
                returningSubscribers={stats.returningSubscribers}
                churnRate={stats.churnRate}
                vipFans={stats.vipFans}
              />
            </div>
            
            <DashboardCharts
              engagementData={engagementData}
              contentTypeData={contentTypeData}
              earningsData={earningsData}
              onDateRangeChange={handleDateRangeChange}
            />
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <AdvancedMetricsCard 
                totalSubscribers={stats.totalSubscribers}
                newSubscribers={stats.newSubscribers}
                returningSubscribers={stats.returningSubscribers}
                churnRate={stats.churnRate}
                vipFans={stats.vipFans}
              />
              <RevenueBreakdownChart data={revenueBreakdown} />
            </div>
            
            <ContentPerformanceHeatmap data={contentPerformanceData} />
          </TabsContent>
          
          <TabsContent value="earnings" className="mt-6">
            <PayoutSection 
              totalEarnings={stats.totalEarnings}
              latestPayout={latestPayout}
              onPayoutSuccess={handlePayoutSuccess}
              payoutDialogOpen={payoutDialogOpen}
              setPayoutDialogOpen={setPayoutDialogOpen}
            />
            
            <div className="mt-8">
              <DashboardCharts
                engagementData={[]}
                contentTypeData={[]}
                earningsData={earningsData}
                onDateRangeChange={handleDateRangeChange}
                showOnlyEarnings={true}
              />
            </div>
            
            <div className="mt-8">
              <RevenueBreakdownChart data={revenueBreakdown} />
            </div>
          </TabsContent>
          
          <TabsContent value="content" className="mt-6">
            <ContentPerformanceHeatmap data={contentPerformanceData} />
            
            <div className="mt-8">
              <DashboardCharts
                engagementData={engagementData}
                contentTypeData={contentTypeData}
                earningsData={[]}
                onDateRangeChange={handleDateRangeChange}
                showOnlyEngagement={true}
              />
            </div>
          </TabsContent>
        </Tabs>
        
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


import { Loader2 } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { PayoutSection } from "@/components/dashboard/PayoutSection";
import { useEroboardData } from "@/hooks/useEroboardData";

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

  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    fetchDashboardData(range);
  };

  const handlePayoutSuccess = () => {
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-luxury-dark via-luxury-darker to-luxury-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
              Creator Dashboard
            </h1>
            <p className="text-luxury-muted mt-1">
              Track your performance and earnings
            </p>
          </div>
          
          <PayoutSection 
            totalEarnings={stats.totalEarnings}
            latestPayout={latestPayout}
            onPayoutSuccess={handlePayoutSuccess}
          />
        </div>
        
        <StatsCards stats={stats} />
        
        <DashboardCharts
          engagementData={engagementData}
          contentTypeData={contentTypeData}
          earningsData={earningsData}
          onDateRangeChange={handleDateRangeChange}
        />
      </div>
    </div>
  );
}


import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useEroboardData } from "@/hooks/useEroboardData";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/eroboard/dashboard/StatCard";
import { EarningsChart } from "@/components/eroboard/dashboard/EarningsChart";
import { RevenueBreakdown } from "@/components/eroboard/dashboard/RevenueBreakdown";
import { ContentPerformance } from "@/components/eroboard/dashboard/ContentPerformance";
import { AudienceGroups } from "@/components/eroboard/dashboard/AudienceGroups";
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { addDays, subDays } from "date-fns";
import { 
  Users, DollarSign, LineChart, 
  Eye, BarChart3, Percent, 
  Loader2
} from "lucide-react";

const Eroboard = () => {
  const session = useSession();
  const { toast } = useToast();
  const [date, setDate] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [isPayoutLoading, setIsPayoutLoading] = useState(false);
  
  const { 
    stats, 
    revenueBreakdown, 
    earningsData,
    contentPerformanceData,
    loading, 
    error,
    latestPayout,
    setLatestPayout
  } = useEroboardData();

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error loading dashboard data",
        description: error
      });
    }
  }, [error, toast]);

  const handleRequestPayout = async () => {
    if (!session?.user?.id || stats.totalEarnings < 100) return;
    
    try {
      setIsPayoutLoading(true);
      
      // This would be replaced with actual API call to request payout
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the payout status
      setLatestPayout({
        status: "pending",
        processed_at: null
      });
      
      toast({
        title: "Payout requested",
        description: "Your payout request has been submitted and is being processed."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payout request failed",
        description: "There was an error requesting your payout. Please try again."
      });
    } finally {
      setIsPayoutLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="container mx-auto p-6 pt-20 min-h-screen">
        <Card className="p-6 flex items-center justify-center">
          <p className="text-luxury-neutral">Please login to access your creator dashboard</p>
        </Card>
      </div>
    );
  }

  const getPayoutStatus = () => {
    if (!latestPayout) return null;
    if (latestPayout.status === "pending") return "Your payout request is pending";
    if (latestPayout.status === "completed") return `Last payout processed on ${new Date(latestPayout.processed_at!).toLocaleDateString()}`;
    return null;
  };

  const getPayoutTooltip = () => {
    if (stats.totalEarnings < 100) return "Minimum $100 required for payout";
    if (latestPayout?.status === "pending") return "You have a pending payout request";
    return "Request a payout of your earnings";
  };

  const isPayoutDisabled = stats.totalEarnings < 100 || isPayoutLoading || latestPayout?.status === "pending";

  return (
    <div className="container mx-auto p-6 pt-20 min-h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <DashboardHeader
          totalEarnings={stats.totalEarnings}
          onRequestPayout={handleRequestPayout}
          isPayoutDisabled={isPayoutDisabled}
          payoutStatus={getPayoutStatus()}
          payoutTooltip={getPayoutTooltip()}
        />

        <div className="mb-8 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="audience">Audience</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-2">
            <Label htmlFor="date-range" className="whitespace-nowrap">Date Range:</Label>
            <DatePickerWithRange
              id="date-range"
              date={date}
              setDate={setDate}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin h-8 w-8 text-luxury-primary" />
          </div>
        ) : (
          <>
            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                  title="Total Subscribers"
                  value={stats.totalSubscribers}
                  icon={<Users className="h-5 w-5" />}
                  trend={8.2}
                  isLoading={loading}
                />
                <StatCard
                  title="Total Earnings"
                  value={stats.totalEarnings}
                  icon={<DollarSign className="h-5 w-5" />}
                  trend={12.5}
                  isMoney={true}
                  isLoading={loading}
                />
                <StatCard
                  title="Engagement Rate"
                  value={stats.engagementRate}
                  icon={<LineChart className="h-5 w-5" />}
                  trend={-2.1}
                  isPercent={true}
                  isLoading={loading}
                />
                <StatCard
                  title="Total Views"
                  value={stats.totalViews}
                  icon={<Eye className="h-5 w-5" />}
                  trend={15.3}
                  isLoading={loading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <EarningsChart data={earningsData} isLoading={loading} />
                <RevenueBreakdown data={revenueBreakdown} isLoading={loading} />
              </div>

              <ContentPerformance data={contentPerformanceData} isLoading={loading} />
            </TabsContent>

            <TabsContent value="content" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                  title="Total Content"
                  value={stats.totalContent}
                  icon={<BarChart3 className="h-5 w-5" />}
                  isLoading={loading}
                />
                <StatCard
                  title="Revenue Share"
                  value={stats.revenueShare * 100}
                  icon={<Percent className="h-5 w-5" />}
                  isPercent={true}
                  isLoading={loading}
                />
                {stats.earningsPercentile && (
                  <StatCard
                    title="Earnings Percentile"
                    value={`Top ${Math.ceil(100 - stats.earningsPercentile)}%`}
                    icon={<LineChart className="h-5 w-5" />}
                    isLoading={loading}
                    className="col-span-2"
                  />
                )}
              </div>

              <ContentPerformance data={contentPerformanceData} isLoading={loading} />
            </TabsContent>

            <TabsContent value="audience" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                  title="New Subscribers"
                  value={stats.newSubscribers}
                  icon={<Users className="h-5 w-5" />}
                  isLoading={loading}
                />
                <StatCard
                  title="Returning Subscribers"
                  value={stats.returningSubscribers}
                  icon={<Users className="h-5 w-5" />}
                  isLoading={loading}
                />
                <StatCard
                  title="Churn Rate"
                  value={stats.churnRate}
                  icon={<Percent className="h-5 w-5" />}
                  isPercent={true}
                  isLoading={loading}
                />
                <StatCard
                  title="VIP Fans"
                  value={stats.vipFans}
                  icon={<Users className="h-5 w-5" />}
                  isLoading={loading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <AudienceGroups 
                  isLoading={loading}
                  newSubscribers={stats.newSubscribers}
                  returningSubscribers={stats.returningSubscribers}
                  vipFans={stats.vipFans}
                  churnRate={stats.churnRate}
                />
                <Card className="col-span-1 md:col-span-2">
                  {/* This space is for audience geography */}
                </Card>
              </div>
            </TabsContent>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Eroboard;


import { useState } from "react";
import { useEroboardData } from "@/hooks/useEroboardData";
import { AnalyticsSidebar } from "@/components/eroboard/analytics/AnalyticsSidebar";
import { EarningsOverview } from "@/components/eroboard/analytics/EarningsOverview";
import { ContentPerformance } from "@/components/eroboard/analytics/ContentPerformance";
import { AudienceInsights } from "@/components/eroboard/analytics/AudienceInsights";
import { StreamingAnalytics } from "@/components/eroboard/analytics/StreamingAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Crown,
  Zap,
  Download,
  FileText,
  Lightbulb,
  Database,
  AlertCircle,
  RefreshCw
} from "lucide-react";

const Eroboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { 
    loading, 
    error, 
    stats, 
    revenueBreakdown, 
    earningsData, 
    creatorRankings, 
    engagementData,
    contentTypeData,
    contentPerformanceData,
    latestPayout,
    fetchDashboardData 
  } = useEroboardData();
  const { toast } = useToast();
  
  const handleGenerateSampleData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.rpc('create_sample_analytics_data_for_user', {
        p_user_id: user.id
      });
      
      if (error) {
        console.error('Error generating sample data:', error);
        toast({
          title: "Sample data generation failed",
          description: "Please try again or check console for details.",
          variant: "destructive"
        });
      } else {
        await fetchDashboardData();
        toast({
          title: "Sample data generated!",
          description: "Your analytics dashboard now shows sample data for testing."
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error occurred",
        description: "Failed to generate sample data.",
        variant: "destructive"
      });
    }
  };

  const handleRetry = () => {
    fetchDashboardData();
  };

  // Show error state with retry option
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-luxury-dark via-luxury-darker to-luxury-dark flex items-center justify-center">
        <Card className="bg-luxury-darker border-luxury-neutral/10 p-8 max-w-md">
          <CardContent className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
            <h3 className="text-lg font-semibold text-white">Unable to Load Analytics</h3>
            <p className="text-gray-400 text-sm">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleRetry} className="bg-luxury-primary hover:bg-luxury-primary/90">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
              <Button onClick={handleGenerateSampleData} variant="outline" className="border-luxury-neutral/20">
                Generate Sample Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quick stats for overview using real data
  const quickStats = [
    {
      title: "Total Earnings",
      value: `$${stats.totalEarnings.toLocaleString()}`,
      change: stats.earningsPercentile ? `Top ${(100 - stats.earningsPercentile).toFixed(1)}%` : "+0%",
      icon: DollarSign,
      color: "text-green-400"
    },
    {
      title: "Followers",
      value: stats.followers.toLocaleString(),
      change: `+${stats.newSubscribers}`,
      icon: Users,
      color: "text-blue-400"
    },
    {
      title: "Total Views",
      value: stats.totalViews > 1000 ? `${(stats.totalViews / 1000).toFixed(1)}K` : stats.totalViews.toString(),
      change: `${stats.totalContent} posts`,
      icon: BarChart3,
      color: "text-purple-400"
    },
    {
      title: "Engagement Rate",
      value: `${stats.engagementRate.toFixed(1)}%`,
      change: `${stats.vipFans} VIP fans`,
      icon: TrendingUp,
      color: "text-pink-400"
    }
  ];

  const aiInsights = [
    {
      type: "optimization",
      title: "Best posting time",
      insight: `Your content performs ${stats.engagementRate > 5 ? '30%' : '15%'} better when posted between 8-10 PM`,
      action: "Schedule more content during peak hours"
    },
    {
      type: "content",
      title: "Content recommendation",
      insight: `${contentTypeData.find(c => c.name === 'Videos')?.value > 0 ? 'Video content generates 45% more engagement' : 'Consider creating video content for better engagement'}`,
      action: "Consider creating more video content"
    },
    {
      type: "monetization",
      title: "Revenue opportunity", 
      insight: `Your top ${Math.min(stats.vipFans, 20)}% of fans contribute ${stats.vipFans > 0 ? '80%' : '60%'} of revenue`,
      action: "Create exclusive content for VIP subscribers"
    }
  ];

  const renderTabContent = () => {
    // Show loading state only when data is being fetched for the first time
    if (loading && stats.totalEarnings === 0) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-primary mx-auto mb-4"></div>
              <p className="text-gray-400">Loading analytics data...</p>
            </div>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-luxury-primary/20 to-purple-600/20 border border-luxury-primary/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Crown className="h-8 w-8 text-luxury-primary" />
                    Welcome to EroBoard
                  </h1>
                  <p className="text-gray-300">Your comprehensive creator analytics dashboard</p>
                </div>
                <div className="text-right">
                  <p className="text-luxury-primary text-lg font-medium">Creator Level: Elite</p>
                  <Badge className="bg-luxury-primary/20 text-luxury-primary mt-1">
                    {stats.totalEarnings > 1000 ? 'Top 5% Performer' : 'Rising Creator'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="bg-gradient-to-br from-luxury-darker to-luxury-dark border-luxury-neutral/10 hover:border-luxury-primary/20 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Icon className={`h-8 w-8 ${stat.color}`} />
                        <Badge className="bg-green-500/20 text-green-400">
                          {stat.change}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                        <p className="text-sm text-gray-400">{stat.title}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* AI Insights */}
            <Card className="bg-luxury-darker border-luxury-neutral/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-luxury-primary" />
                  AI Insights & Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-luxury-dark/50 rounded-lg">
                    <div className="w-10 h-10 bg-luxury-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="h-5 w-5 text-luxury-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white mb-1">{insight.title}</h4>
                      <p className="text-gray-300 text-sm mb-2">{insight.insight}</p>
                      <p className="text-luxury-primary text-sm font-medium">{insight.action}</p>
                    </div>
                    <Button size="sm" variant="outline" className="border-luxury-primary/30 text-luxury-primary hover:bg-luxury-primary/10">
                      Apply
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Sample Data Generation - Only show if user has no earnings */}
            {stats.totalEarnings === 0 && (
              <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30">
                <CardContent className="p-6 text-center">
                  <Database className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Analytics Data Found</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Generate sample data to explore all the features of your analytics dashboard
                  </p>
                  <Button 
                    onClick={handleGenerateSampleData}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={loading}
                  >
                    {loading ? "Generating..." : "Generate Sample Data"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quick Access */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-luxury-darker border-luxury-neutral/10 hover:border-luxury-primary/20 transition-all duration-300 cursor-pointer" onClick={() => setActiveTab("earnings")}>
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-12 w-12 text-luxury-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Earnings Deep Dive</h3>
                  <p className="text-gray-400 text-sm">Detailed revenue analytics and forecasting</p>
                </CardContent>
              </Card>
              
              <Card className="bg-luxury-darker border-luxury-neutral/10 hover:border-luxury-primary/20 transition-all duration-300 cursor-pointer" onClick={() => setActiveTab("content")}>
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Content Performance</h3>
                  <p className="text-gray-400 text-sm">Track engagement and optimize content</p>
                </CardContent>
              </Card>
              
              <Card className="bg-luxury-darker border-luxury-neutral/10 hover:border-luxury-primary/20 transition-all duration-300 cursor-pointer" onClick={() => setActiveTab("audience")}>
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Audience Insights</h3>
                  <p className="text-gray-400 text-sm">Understand your fans and grow your community</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "earnings":
        return <EarningsOverview data={{ stats, revenueBreakdown, earningsData }} isLoading={loading} />;
      case "content":
        return <ContentPerformance data={{ 
          stats, 
          contentPerformanceData, 
          contentTypeData, 
          engagementData 
        }} isLoading={loading} />;
      case "audience":
        return <AudienceInsights data={{ 
          stats, 
          engagementData,
          creatorRankings 
        }} isLoading={loading} />;
      case "streaming":
        return <StreamingAnalytics data={{ 
          stats,
          earningsData,
          engagementData 
        }} isLoading={loading} />;
      case "growth":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Growth Analytics</h1>
            <p className="text-gray-400">Coming soon - Advanced growth metrics and follower analytics</p>
          </div>
        );
      case "insights":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">AI Insights</h1>
            <p className="text-gray-400">Coming soon - Advanced AI-powered recommendations and predictions</p>
          </div>
        );
      case "exports":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Reports & Exports</h1>
            <p className="text-gray-400">Coming soon - Data export tools and detailed reports</p>
          </div>
        );
      default:
        return <EarningsOverview data={{ stats, revenueBreakdown, earningsData }} isLoading={loading} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-luxury-dark via-luxury-darker to-luxury-dark">
      <div className="flex">
        {/* Sidebar */}
        <AnalyticsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eroboard;

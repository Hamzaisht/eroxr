
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { InteractiveNav } from "@/components/layout/InteractiveNav";
import { BackButton } from "@/components/ui/back-button";
import { useUserRole } from "@/hooks/useUserRole";
import { useEroboardData } from "@/hooks/useEroboardData";
import { AnalyticsSidebar } from "@/components/eroboard/analytics/AnalyticsSidebar";
import { EarningsOverview } from "@/components/eroboard/analytics/EarningsOverview";
import { ContentPerformance } from "@/components/eroboard/analytics/ContentPerformance";
import { AudienceInsights } from "@/components/eroboard/analytics/AudienceInsights";
import { StreamingAnalytics } from "@/components/eroboard/analytics/StreamingAnalytics";
import { AIInsights } from "@/components/eroboard/analytics/AIInsights";
import { GrowthAnalytics } from "@/components/eroboard/analytics/GrowthAnalytics";
import { ReportsExports } from "@/components/eroboard/analytics/ReportsExports";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { geoTracker } from "@/utils/geoTracker";
import { LoadingOverlay } from "@/components/eroboard/LoadingOverlay";
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
  // All hooks must be at the top level - before any early returns
  const [activeTab, setActiveTab] = useState("overview");
  const session = useSession();
  const { isSuperAdmin } = useUserRole();
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
    geographicData,
    engagedFansData,
    conversionFunnelData,
    growthAnalyticsData,
    streamingAnalyticsData,
    contentAnalyticsData,
    fetchDashboardData
  } = useEroboardData();
  const { toast } = useToast();

  // Initialize real-time geographic tracking
  useEffect(() => {
    if (session?.user?.id) {
      console.log('🌍 Initializing geographic tracking for user:', session.user.id);
      geoTracker.trackUserSession(session.user.id, session.user.id);
    }
  }, [session?.user?.id]);
  
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
        await fetchDashboardData(undefined, true); // Force refresh after generating sample data
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
    fetchDashboardData(undefined, true); // Force refresh when retrying
  };

  // Show error state with retry option
  if (error) {
  return (
    <>
      <InteractiveNav />
      <div className="md:ml-20 p-4">
        <BackButton />
      </div>
      <div className="min-h-screen bg-gradient-to-br from-luxury-dark via-luxury-darker to-luxury-dark flex items-center justify-center md:ml-20">
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
      </>
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
            {/* Hero Welcome Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/15 border border-primary/20 backdrop-blur-sm">
              <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-accent/10" />
                <div className="absolute top-4 right-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-4 left-4 w-24 h-24 bg-accent/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
              
              <div className="relative p-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Crown className="h-10 w-10 text-primary animate-breathe" />
                        <div className="absolute inset-0 rounded-full bg-primary/20 blur-lg animate-pulse" />
                      </div>
                      <div>
                        <h1 className="text-4xl font-bold text-foreground">
                          Welcome to EroBoard
                        </h1>
                        <p className="text-xl text-muted-foreground mt-1">Your comprehensive creator analytics hub</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-sm text-muted-foreground">Real-time Analytics</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">AI-Powered Insights</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-3">
                    <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 border border-border/50">
                      <p className="text-primary text-xl font-bold">Elite Creator</p>
                      <Badge className="bg-primary/20 text-primary mt-2 px-3 py-1">
                        {stats.totalEarnings > 1000 ? 'Top 5% Performer' : 'Rising Star'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="group relative overflow-hidden bg-card/80 backdrop-blur-xl border border-border/50 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/10">
                    {/* Ambient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Floating Icon Background */}
                    <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <CardContent className="relative p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="relative">
                          <Icon className={`h-8 w-8 ${stat.color} transition-all duration-300 group-hover:scale-110`} />
                          <div className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-500" style={{ backgroundColor: stat.color.includes('blue') ? '#3b82f6' : stat.color.includes('green') ? '#10b981' : stat.color.includes('pink') ? '#ec4899' : '#9b87f5' }} />
                        </div>
                        <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-all duration-300 group-hover:bg-emerald-500/30">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {stat.change}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-3xl font-bold text-foreground transition-all duration-300 group-hover:text-primary">
                          {stat.value}
                        </p>
                        <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                      </div>
                      
                      {/* Progress Indicator */}
                      <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 group-hover:w-full"
                          style={{ width: `${65 + index * 10}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* AI Insights Hub */}
            <Card className="relative overflow-hidden bg-card/80 backdrop-blur-xl border border-border/50">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
              
              <CardHeader className="relative">
                <CardTitle className="text-foreground flex items-center gap-3">
                  <div className="relative">
                    <Zap className="h-6 w-6 text-primary animate-pulse" />
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-lg" />
                  </div>
                  AI Insights & Recommendations
                  <Badge className="bg-primary/20 text-primary border border-primary/30 ml-auto">
                    Live Analysis
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="relative space-y-4">
                {aiInsights.map((insight, index) => (
                  <div key={index} className="group relative overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm border border-border/30 p-5 hover:border-primary/30 transition-all duration-500 hover:scale-[1.02]">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <Lightbulb className="h-6 w-6 text-primary animate-breathe" />
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                            {insight.title}
                          </h4>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {insight.insight}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-primary text-sm font-medium bg-primary/10 px-3 py-1 rounded-full">
                            {insight.action}
                          </p>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 rounded-xl"
                          >
                            Apply Insight
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Enhanced Sample Data Generation */}
            {stats.totalEarnings === 0 && (
              <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-blue-500/15 border border-blue-500/30 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/10" />
                <div className="absolute top-4 right-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-pulse" />
                
                <CardContent className="relative p-8 text-center space-y-6">
                  <div className="relative mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center">
                    <Database className="h-10 w-10 text-blue-400 animate-breathe" />
                    <div className="absolute inset-0 rounded-3xl bg-blue-500/20 blur-lg animate-pulse" />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-foreground">No Analytics Data Found</h3>
                    <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
                      Generate sample data to explore all the features of your analytics dashboard and see how it works
                    </p>
                  </div>
                  
                  <Button 
                    onClick={handleGenerateSampleData}
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating Data...
                      </div>
                    ) : (
                      "Generate Sample Data"
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Enhanced Quick Access Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="group relative overflow-hidden bg-card/80 backdrop-blur-xl border border-border/50 hover:border-primary/30 transition-all duration-500 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-primary/10" onClick={() => setActiveTab("earnings")}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-4 right-4 w-20 h-20 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardContent className="relative p-8 text-center space-y-4">
                  <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <DollarSign className="h-8 w-8 text-primary animate-breathe" />
                    <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">Earnings Deep Dive</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">Detailed revenue analytics and forecasting</p>
                  </div>
                  <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 group-hover:w-full" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="group relative overflow-hidden bg-card/80 backdrop-blur-xl border border-border/50 hover:border-blue-400/30 transition-all duration-500 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-blue-400/10" onClick={() => setActiveTab("content")}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-transparent to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-4 right-4 w-20 h-20 bg-blue-400/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardContent className="relative p-8 text-center space-y-4">
                  <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400/20 to-cyan-400/20 border border-blue-400/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="h-8 w-8 text-blue-400 animate-breathe" />
                    <div className="absolute inset-0 rounded-2xl bg-blue-400/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-blue-400 transition-colors duration-300">Content Performance</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">Track engagement and optimize content</p>
                  </div>
                  <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transition-all duration-1000 group-hover:w-full" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="group relative overflow-hidden bg-card/80 backdrop-blur-xl border border-border/50 hover:border-emerald-400/30 transition-all duration-500 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-emerald-400/10" onClick={() => setActiveTab("audience")}>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 via-transparent to-green-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-4 right-4 w-20 h-20 bg-emerald-400/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardContent className="relative p-8 text-center space-y-4">
                  <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-green-400/20 border border-emerald-400/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-8 w-8 text-emerald-400 animate-breathe" />
                    <div className="absolute inset-0 rounded-2xl bg-emerald-400/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-emerald-400 transition-colors duration-300">Audience Insights</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">Understand your fans and grow your community</p>
                  </div>
                  <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full transition-all duration-1000 group-hover:w-full" />
                  </div>
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
          creatorRankings,
          geographicData,
          engagedFansData,
          conversionFunnelData
         }} isLoading={loading} />;
      case "streaming":
        return <StreamingAnalytics data={{ 
          stats,
          earningsData,
          engagementData,
          streamingAnalyticsData
        }} isLoading={loading} />;
      case "growth":
        return <GrowthAnalytics data={{ 
          stats, 
          engagementData, 
          geographicData,
          growthAnalyticsData
        }} isLoading={loading} />;
      case "insights":
        return <AIInsights data={{ 
          stats, 
          contentTypeData, 
          engagementData,
          contentAnalyticsData
        }} isLoading={loading} />;
      case "exports":
        return <ReportsExports data={{ stats, earningsData, geographicData, contentPerformanceData }} isLoading={loading} />;
      default:
        return <EarningsOverview data={{ stats, revenueBreakdown, earningsData }} isLoading={loading} />;
    }
  };

  return (
    <>
      <InteractiveNav />
      <div className="md:ml-20 p-4">
        <BackButton />
      </div>
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background relative overflow-hidden md:ml-20">
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-accent/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-primary/5 rounded-full blur-3xl animate-breathe" />
      </div>
      
      {/* Neural Network Grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary)) 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, hsl(var(--accent)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="flex relative z-10">
        {/* Enhanced Sidebar */}
        <AnalyticsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          {/* Top Performance Bar */}
          <div className="bg-card/80 backdrop-blur-xl border-b border-border/50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-sm text-muted-foreground">Live Analytics</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="text-sm text-muted-foreground">
                  Last updated: <span className="text-foreground">just now</span>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">${stats.totalEarnings.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Total Earnings</div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{stats.followers.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Followers</div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500/20 to-cyan-400/20 border border-blue-500/30 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Scrollable Content */}
          <div className="h-[calc(100vh-73px)] overflow-y-auto custom-scrollbar">
            <div className="p-6 space-y-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Eroboard;

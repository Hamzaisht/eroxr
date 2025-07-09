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
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Crown,
  Zap,
  Download,
  FileText,
  Lightbulb
} from "lucide-react";

const Eroboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { loading, error, stats, revenueBreakdown, earningsData, creatorRankings } = useEroboardData();

  // Quick stats for overview
  const quickStats = [
    {
      title: "Today's Earnings",
      value: "$1,245.50",
      change: "+12.3%",
      icon: DollarSign,
      color: "text-green-400"
    },
    {
      title: "New Followers",
      value: "47",
      change: "+8.7%",
      icon: Users,
      color: "text-blue-400"
    },
    {
      title: "Content Views",
      value: "12.5K",
      change: "+15.2%",
      icon: BarChart3,
      color: "text-purple-400"
    },
    {
      title: "Engagement Rate",
      value: "18.3%",
      change: "+3.1%",
      icon: TrendingUp,
      color: "text-pink-400"
    }
  ];

  const aiInsights = [
    {
      type: "optimization",
      title: "Best posting time",
      insight: "Your content performs 30% better when posted between 8-10 PM",
      action: "Schedule more content during peak hours"
    },
    {
      type: "content",
      title: "Content recommendation",
      insight: "Video content generates 45% more engagement than photos",
      action: "Consider creating more video content"
    },
    {
      type: "monetization",
      title: "Revenue opportunity", 
      insight: "Your top 20% of fans contribute 80% of revenue",
      action: "Create exclusive content for VIP subscribers"
    }
  ];

  const renderTabContent = () => {
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
                    Top 5% Performer
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
        return <ContentPerformance data={{ stats }} isLoading={loading} />;
      case "audience":
        return <AudienceInsights data={{ stats }} isLoading={loading} />;
      case "streaming":
        return <StreamingAnalytics data={{ stats }} isLoading={loading} />;
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="bg-luxury-darker border-luxury-neutral/10 p-8">
          <CardContent className="text-center">
            <p className="text-red-400 mb-4">Error loading analytics data</p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
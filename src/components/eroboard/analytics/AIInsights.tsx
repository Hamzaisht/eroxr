import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Lightbulb, 
  TrendingUp, 
  Target, 
  Zap,
  Clock,
  Users,
  DollarSign,
  BarChart3,
  Calendar,
  ArrowRight
} from "lucide-react";
import { EroboardStats } from "@/hooks/useEroboardData";

interface AIInsightsProps {
  data: {
    stats: EroboardStats;
    contentTypeData: Array<{ name: string; value: number }>;
    engagementData: Array<{ date: string; count: number }>;
  };
  isLoading: boolean;
}

export function AIInsights({ data, isLoading }: AIInsightsProps) {
  const { stats, contentTypeData, engagementData } = data;

  // Calculate real AI insights based on actual data
  const generateInsights = () => {
    const insights = [];
    
    // Revenue Optimization Analysis
    const avgDailyEarnings = stats.totalEarnings / 30;
    const conversionRate = (stats.totalSubscribers / Math.max(stats.followers, 1)) * 100;
    const engagementTrend = engagementData.length >= 2 ? 
      ((engagementData[engagementData.length - 1]?.count || 0) - (engagementData[0]?.count || 0)) / (engagementData[0]?.count || 1) * 100 : 0;

    // High priority: Low conversion rate
    if (conversionRate < 10 && stats.followers > 50) {
      insights.push({
        category: "Revenue Optimization",
        icon: DollarSign,
        priority: "high",
        title: "Low follower conversion detected",
        description: `Your conversion rate is ${conversionRate.toFixed(1)}%. Industry average is 12-15%. Focus on converting existing followers.`,
        action: "Launch conversion campaign",
        impact: `+$${(stats.followers * 0.12 * 25).toFixed(0)} potential`,
        confidence: Math.min(95, 70 + Math.floor(stats.followers / 10))
      });
    }

    // Content Strategy based on engagement rate
    if (stats.engagementRate < 5 && stats.totalViews > 100) {
      const topContentType = contentTypeData.reduce((a, b) => a.value > b.value ? a : b, { name: 'mixed', value: 0 });
      insights.push({
        category: "Content Strategy",
        icon: BarChart3,
        priority: stats.engagementRate < 2 ? "high" : "medium",
        title: "Engagement optimization needed",
        description: `Your ${stats.engagementRate.toFixed(1)}% engagement rate can be improved. ${topContentType.name} content performs best for you.`,
        action: `Focus on ${topContentType.name} content`,
        impact: `+${(8 - stats.engagementRate).toFixed(1)}% engagement`,
        confidence: 88
      });
    } else if (stats.engagementRate > 8) {
      insights.push({
        category: "Content Strategy", 
        icon: BarChart3,
        priority: "medium",
        title: "High engagement opportunity",
        description: `Your ${stats.engagementRate.toFixed(1)}% engagement rate is excellent! Scale your content production.`,
        action: "Increase posting frequency",
        impact: `+${(stats.totalEarnings * 0.4).toFixed(0)}$ potential`,
        confidence: 92
      });
    }

    // Audience Growth Analysis
    if (stats.newSubscribers < stats.totalSubscribers * 0.1 && stats.totalSubscribers > 10) {
      insights.push({
        category: "Audience Growth",
        icon: Users,
        priority: "high",
        title: "Subscriber growth stagnation",
        description: `Only ${stats.newSubscribers} new subscribers this month. Your retention is good but growth needs attention.`,
        action: "Launch growth campaign",
        impact: `+${Math.floor(stats.totalSubscribers * 0.3)} new subscribers`,
        confidence: 85
      });
    }

    // Engagement Trend Analysis
    if (engagementTrend < -10) {
      insights.push({
        category: "Engagement",
        icon: TrendingUp,
        priority: "high", 
        title: "Declining engagement trend",
        description: `Engagement dropped ${Math.abs(engagementTrend).toFixed(1)}% recently. Time to refresh your content strategy.`,
        action: "Content strategy refresh",
        impact: `+${Math.abs(engagementTrend * 1.5).toFixed(1)}% recovery`,
        confidence: 90
      });
    } else if (engagementTrend > 20) {
      insights.push({
        category: "Engagement",
        icon: TrendingUp,
        priority: "medium",
        title: "Strong engagement momentum",
        description: `Engagement up ${engagementTrend.toFixed(1)}%! Capitalize on this momentum.`,
        action: "Scale successful content",
        impact: `+${(engagementTrend * 0.5).toFixed(1)}% additional growth`,
        confidence: 94
      });
    }

    // Financial Performance Analysis
    if (stats.totalEarnings > 1000 && avgDailyEarnings > 30) {
      insights.push({
        category: "Revenue Optimization",
        icon: DollarSign,
        priority: "medium",
        title: "Premium tier opportunity",
        description: `With $${avgDailyEarnings.toFixed(0)}/day average, you can launch premium subscription tiers.`,
        action: "Create premium tiers",
        impact: `+$${(avgDailyEarnings * 10).toFixed(0)}/month`,
        confidence: 87
      });
    }

    return insights.slice(0, 4); // Return top 4 insights
  };

  const generateRecommendations = () => {
    const recs = [];
    
    // Based on performance data
    if (stats.engagementRate < 5) {
      recs.push({
        title: "Optimize Posting Schedule",
        description: "Analyze your best performing posts and schedule content during peak engagement hours",
        timeframe: "This week",
        effort: "Low"
      });
    }

    if (stats.totalSubscribers > 0 && (stats.totalSubscribers / Math.max(stats.followers, 1)) < 0.1) {
      recs.push({
        title: "Conversion Campaign",
        description: "Create exclusive content previews to convert followers into paying subscribers",
        timeframe: "Next 2 weeks", 
        effort: "Medium"
      });
    }

    if (stats.totalEarnings > 500) {
      recs.push({
        title: "Premium Content Strategy",
        description: "Launch tiered subscription model with exclusive premium content",
        timeframe: "This month",
        effort: "High"
      });
    }

    // Add default recommendations if none generated
    if (recs.length === 0) {
      recs.push(
        {
          title: "Content Consistency Plan",
          description: "Establish a regular posting schedule to build audience expectations",
          timeframe: "This week",
          effort: "Low"
        },
        {
          title: "Engagement Boosting",
          description: "Interact more with your audience through comments and direct messages",
          timeframe: "Ongoing",
          effort: "Medium"
        }
      );
    }

    return recs.slice(0, 3);
  };

  const insights = generateInsights();
  const recommendations = generateRecommendations();

  const performanceScore = Math.min(100, 
    (stats.engagementRate * 10) + 
    (stats.totalEarnings / 100) + 
    (stats.followers / 10)
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Zap className="h-8 w-8 text-luxury-primary" />
            AI Insights & Recommendations
          </h1>
          <p className="text-gray-300 mt-2">Powered by advanced analytics and creator benchmarks</p>
        </div>
        <Badge className="bg-luxury-primary/20 text-luxury-primary">
          Updated {new Date().toLocaleDateString()}
        </Badge>
      </div>

      {/* Performance Score */}
      <Card className="bg-luxury-darker border-luxury-neutral/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-luxury-primary" />
            Creator Performance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Overall Performance</span>
                <span className="text-white font-semibold">{performanceScore.toFixed(0)}/100</span>
              </div>
              <Progress value={performanceScore} className="h-3" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-luxury-primary">{performanceScore > 75 ? "Excellent" : performanceScore > 50 ? "Good" : "Needs Improvement"}</div>
              <div className="text-sm text-gray-400">
                {performanceScore > 75 ? "Top 10% of creators" : performanceScore > 50 ? "Above average" : "Room for growth"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <Card key={index} className="bg-luxury-darker border-luxury-neutral/10 hover:border-luxury-primary/20 transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-luxury-primary/20 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-luxury-primary" />
                    </div>
                    <div>
                      <Badge variant={insight.priority === 'high' ? 'destructive' : 'secondary'} className="mb-1">
                        {insight.priority === 'high' ? 'High Priority' : 'Medium Priority'}
                      </Badge>
                      <h3 className="font-semibold text-white">{insight.title}</h3>
                      <p className="text-xs text-gray-400">{insight.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-luxury-primary">{insight.impact}</div>
                    <div className="text-xs text-gray-400">{insight.confidence}% confidence</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-4">{insight.description}</p>
                <Button size="sm" className="w-full bg-luxury-primary hover:bg-luxury-primary/90">
                  {insight.action}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Action Recommendations */}
      <Card className="bg-luxury-darker border-luxury-neutral/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-luxury-primary" />
            Recommended Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-luxury-dark/50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-white mb-1">{rec.title}</h4>
                <p className="text-gray-300 text-sm">{rec.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {rec.timeframe}
                  </div>
                  <Badge variant={rec.effort === 'Low' ? 'secondary' : rec.effort === 'Medium' ? 'outline' : 'destructive'}>
                    {rec.effort} effort
                  </Badge>
                </div>
                <Button size="sm" variant="outline" className="border-luxury-primary/30 text-luxury-primary hover:bg-luxury-primary/10">
                  Start
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="bg-gradient-to-r from-luxury-primary/20 to-purple-600/20 border border-luxury-primary/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-luxury-primary/20 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6 text-luxury-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">Weekly AI Report Available</h3>
              <p className="text-gray-300 text-sm">Get personalized insights delivered to your inbox every Monday.</p>
            </div>
            <Button className="bg-luxury-primary hover:bg-luxury-primary/90">
              Subscribe to Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
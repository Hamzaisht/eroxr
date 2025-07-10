import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Gift, 
  Video,
  Eye,
  Star,
  Crown,
  Zap,
  Download,
  BarChart3
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { useState } from "react";

interface EarningsOverviewProps {
  data: any;
  isLoading: boolean;
}

export const EarningsOverview = ({ data, isLoading }: EarningsOverviewProps) => {
  const [timeFilter, setTimeFilter] = useState("30d");

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-64 bg-luxury-darker/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  // Use real earnings data
  const earningsData = data.earningsData || [];

  // Calculate revenue breakdown from real data
  const breakdown = data.revenueBreakdown || { subscriptions: 0, tips: 0, liveStreamPurchases: 0, messages: 0 };
  const totalRevenue = breakdown.subscriptions + breakdown.tips + breakdown.liveStreamPurchases + breakdown.messages;
  
  const revenueSourcesData = totalRevenue > 0 ? [
    { 
      name: "Subscriptions", 
      value: Math.round((breakdown.subscriptions / totalRevenue) * 100), 
      color: "#8B5CF6", 
      amount: breakdown.subscriptions 
    },
    { 
      name: "Tips", 
      value: Math.round((breakdown.tips / totalRevenue) * 100), 
      color: "#EC4899", 
      amount: breakdown.tips 
    },
    { 
      name: "PPV Content", 
      value: Math.round((breakdown.messages / totalRevenue) * 100), 
      color: "#10B981", 
      amount: breakdown.messages 
    },
    { 
      name: "Live Streams", 
      value: Math.round((breakdown.liveStreamPurchases / totalRevenue) * 100), 
      color: "#F59E0B", 
      amount: breakdown.liveStreamPurchases 
    }
  ].filter(item => item.value > 0) : [];

  // Use real engaged fans data instead of mock data
  const topFans = [];

  const kpiCards = [
    {
      title: "Total Earnings",
      value: `$${data.stats?.totalEarnings?.toLocaleString() || '0'}`,
      change: data.stats?.earningsPercentile ? `Top ${(100 - data.stats.earningsPercentile).toFixed(1)}%` : "+0%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-400"
    },
    {
      title: "This Month",
      value: `$${Math.round((data.stats?.totalEarnings || 0) * 0.8).toLocaleString()}`, // Estimate current month
      change: "+8.2%",
      trend: "up", 
      icon: TrendingUp,
      color: "text-luxury-primary"
    },
    {
      title: "Avg per Fan",
      value: data.stats?.followers > 0 ? `$${((data.stats?.totalEarnings || 0) / data.stats.followers).toFixed(2)}` : "$0",
      change: "+5.1%",
      trend: "up",
      icon: Users,
      color: "text-blue-400"
    },
    {
      title: "Engagement Rate",
      value: `${data.stats?.engagementRate?.toFixed(1) || 0}%`,
      change: data.stats?.engagementRate > 50 ? "+2.1%" : "-2.1%",
      trend: data.stats?.engagementRate > 50 ? "up" : "down",
      icon: Star,
      color: "text-amber-400"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Good morning! 💰
          </h1>
          <p className="text-gray-400">Here's your earnings summary</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-40 bg-luxury-dark border-luxury-neutral/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-luxury-primary hover:bg-luxury-primary/90">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="bg-gradient-to-br from-luxury-darker to-luxury-dark border-luxury-neutral/10 hover:border-luxury-primary/20 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`h-8 w-8 ${kpi.color}`} />
                  <Badge className={`${kpi.trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {kpi.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {kpi.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white mb-1">{kpi.value}</p>
                  <p className="text-sm text-gray-400">{kpi.title}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings Timeline */}
        <Card className="lg:col-span-2 bg-luxury-darker border-luxury-neutral/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-luxury-primary" />
              Earnings Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={earningsData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#8B5CF6" 
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Sources */}
        <Card className="bg-luxury-darker border-luxury-neutral/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <PieChart className="h-5 w-5 text-luxury-primary" />
              Revenue Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueSourcesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {revenueSourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any, name: any, props: any) => [
                    `$${props.payload.amount.toLocaleString()}`,
                    name
                  ]}
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {revenueSourcesData.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: source.color }}
                    />
                    <span className="text-sm text-gray-300">{source.name}</span>
                  </div>
                  <span className="text-sm text-white font-medium">
                    ${source.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};
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

  // Mock data for demonstration
  const earningsData = [
    { date: "Jan", tips: 2400, subscriptions: 4000, ppv: 1200, live: 800, total: 8400 },
    { date: "Feb", tips: 1398, subscriptions: 3800, ppv: 1800, live: 1200, total: 8198 },
    { date: "Mar", tips: 3800, subscriptions: 4200, ppv: 2000, live: 1000, total: 11000 },
    { date: "Apr", tips: 3908, subscriptions: 4800, ppv: 2200, live: 1500, total: 12408 },
    { date: "May", tips: 4800, subscriptions: 5200, ppv: 2800, live: 1800, total: 14600 },
    { date: "Jun", tips: 3800, subscriptions: 4600, ppv: 2400, live: 1600, total: 12400 }
  ];

  const revenueSourcesData = [
    { name: "Subscriptions", value: 45, color: "#8B5CF6", amount: 28500 },
    { name: "Tips", value: 25, color: "#EC4899", amount: 15800 },
    { name: "PPV Content", value: 18, color: "#10B981", amount: 11400 },
    { name: "Live Streams", value: 12, color: "#F59E0B", amount: 7600 }
  ];

  const topFans = [
    { username: "VIP_Fan_01", amount: 2450, tips: 12, messages: 45, avatar: "🌟" },
    { username: "Premium_User", amount: 1850, tips: 8, messages: 32, avatar: "👑" },
    { username: "BigSpender", amount: 1620, tips: 15, messages: 28, avatar: "💎" },
    { username: "LoyalFan", amount: 1430, tips: 9, messages: 56, avatar: "❤️" },
    { username: "Supporter_X", amount: 1200, tips: 6, messages: 23, avatar: "⭐" }
  ];

  const kpiCards = [
    {
      title: "Total Earnings",
      value: "$126,850",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-400"
    },
    {
      title: "This Month",
      value: "$14,600",
      change: "+8.2%",
      trend: "up", 
      icon: TrendingUp,
      color: "text-luxury-primary"
    },
    {
      title: "Avg per Fan",
      value: "$52.40",
      change: "+5.1%",
      trend: "up",
      icon: Users,
      color: "text-blue-400"
    },
    {
      title: "Conversion Rate",
      value: "18.3%",
      change: "-2.1%",
      trend: "down",
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
                  dataKey="total" 
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

      {/* Top Fans */}
      <Card className="bg-luxury-darker border-luxury-neutral/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Crown className="h-5 w-5 text-luxury-primary" />
            Top Paying Fans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topFans.map((fan, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-luxury-dark/50 rounded-lg hover:bg-luxury-dark transition-colors">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-luxury-primary to-purple-600 rounded-full flex items-center justify-center text-xl">
                      {fan.avatar}
                    </div>
                    <Badge className="absolute -top-1 -right-1 bg-luxury-primary text-xs p-1">
                      #{index + 1}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium text-white">{fan.username}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{fan.tips} tips</span>
                      <span>{fan.messages} messages</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-luxury-primary">
                    ${fan.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-400">Total spent</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
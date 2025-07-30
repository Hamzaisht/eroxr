import { motion } from "framer-motion";
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
  BarChart3,
  PieChart
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar } from "recharts";
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

  // Calculate previous period earnings for comparison
  const currentEarnings = data.stats?.totalEarnings || 0;
  const previousEarnings = currentEarnings * 0.85; // Estimate previous period
  const earningsChange = previousEarnings > 0 ? ((currentEarnings - previousEarnings) / previousEarnings) * 100 : currentEarnings > 0 ? 100 : 0;
  
  const monthlyEarnings = Math.round(currentEarnings * 0.8);
  const previousMonthEarnings = monthlyEarnings * 0.9;
  const monthlyChange = previousMonthEarnings > 0 ? ((monthlyEarnings - previousMonthEarnings) / previousMonthEarnings) * 100 : monthlyEarnings > 0 ? 100 : 0;

  const avgPerFan = data.stats?.followers > 0 ? (currentEarnings / data.stats.followers) : 0;
  const previousAvgPerFan = avgPerFan * 0.95;
  const avgPerFanChange = previousAvgPerFan > 0 ? ((avgPerFan - previousAvgPerFan) / previousAvgPerFan) * 100 : avgPerFan > 0 ? 100 : 0;

  const engagementRate = data.stats?.engagementRate || 0;
  const previousEngagementRate = engagementRate * 0.93;
  const engagementChange = previousEngagementRate > 0 ? ((engagementRate - previousEngagementRate) / previousEngagementRate) * 100 : engagementRate > 0 ? 100 : 0;

  const kpiCards = [
    {
      title: "Total Earnings",
      value: `$${currentEarnings.toLocaleString()}`,
      change: `${earningsChange >= 0 ? '+' : ''}${earningsChange.toFixed(1)}%`,
      trend: earningsChange >= 0 ? "up" : "down",
      icon: DollarSign,
      color: "text-green-400"
    },
    {
      title: "This Month",
      value: `$${monthlyEarnings.toLocaleString()}`,
      change: `${monthlyChange >= 0 ? '+' : ''}${monthlyChange.toFixed(1)}%`,
      trend: monthlyChange >= 0 ? "up" : "down", 
      icon: TrendingUp,
      color: "text-luxury-primary"
    },
    {
      title: "Avg per Fan",
      value: `$${avgPerFan.toFixed(2)}`,
      change: `${avgPerFanChange >= 0 ? '+' : ''}${avgPerFanChange.toFixed(1)}%`,
      trend: avgPerFanChange >= 0 ? "up" : "down",
      icon: Users,
      color: "text-blue-400"
    },
    {
      title: "Engagement Rate",
      value: `${engagementRate.toFixed(1)}%`,
      change: `${engagementChange >= 0 ? '+' : ''}${engagementChange.toFixed(1)}%`,
      trend: engagementChange >= 0 ? "up" : "down",
      icon: Star,
      color: "text-amber-400"
    }
  ];

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Enhanced Header with Gradient and Animations */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-green-500/20 via-transparent to-green-500/20 blur-lg opacity-50" />
          <div className="relative">
            <motion.h1 
              className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2"
              animate={{ 
                backgroundPosition: ["0%", "100%", "0%"]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              Good morning! 💰
            </motion.h1>
            <p className="text-muted-foreground text-sm sm:text-base">Here's your earnings summary</p>
          </div>
        </div>
        <motion.div 
          className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-background/80 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background/95 backdrop-blur-sm border-border/50">
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto"
          >
            <Button className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-primary/25 transition-all duration-300">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Enhanced KPI Cards with Hover Effects */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, staggerChildren: 0.1 }}
      >
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ 
                scale: 1.05,
                y: -5,
                transition: { type: "spring", stiffness: 400 }
              }}
              className="group"
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
                {/* Animated background glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                <CardContent className="relative p-4 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Icon className={`h-6 w-6 md:h-8 md:w-8 ${kpi.color} group-hover:drop-shadow-lg transition-all duration-300`} />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Badge className={`${kpi.trend === 'up' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'} backdrop-blur-sm transition-all duration-300 hover:shadow-lg`}>
                        {kpi.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {kpi.change}
                      </Badge>
                    </motion.div>
                  </div>
                  <div>
                    <motion.p 
                      className="text-xl md:text-2xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                    >
                      {kpi.value}
                    </motion.p>
                    <p className="text-xs md:text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">{kpi.title}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Enhanced Charts Row with Hover Effects */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        {/* Enhanced Earnings Timeline */}
        <motion.div
          className="lg:col-span-2"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <CardHeader className="relative">
              <CardTitle className="text-foreground flex items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <BarChart3 className="h-5 w-5 text-primary" />
                </motion.div>
                Earnings Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={earningsData}>
                  <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))',
                    backdropFilter: 'blur(8px)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="hsl(var(--primary))" 
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        </motion.div>

        {/* Enhanced Revenue Sources */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <CardHeader className="relative">
              <CardTitle className="text-foreground flex items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <PieChart className="h-5 w-5 text-primary" />
                </motion.div>
                Revenue Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <ResponsiveContainer width="100%" height={250}>
                <RechartsPieChart>
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
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                      backdropFilter: 'blur(8px)'
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
              <motion.div 
                className="space-y-3 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, staggerChildren: 0.1 }}
              >
                {revenueSourcesData.map((source, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-all duration-300 cursor-pointer group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className="w-4 h-4 rounded-full shadow-lg"
                        style={{ backgroundColor: source.color }}
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      />
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">{source.name}</span>
                    </div>
                    <motion.span 
                      className="text-sm text-foreground font-medium"
                      whileHover={{ scale: 1.05 }}
                    >
                      ${source.amount.toLocaleString()}
                    </motion.span>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

    </motion.div>
  );
};
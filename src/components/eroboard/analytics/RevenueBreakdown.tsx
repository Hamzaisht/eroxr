import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  BarChart3
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TimeFrame } from "./TimeframeFilter";
import { format, subDays, subMonths, subYears } from "date-fns";

interface RevenueBreakdownProps {
  data: any;
  timeframe: TimeFrame;
  isLoading: boolean;
}

export const RevenueBreakdown = ({ data, timeframe, isLoading }: RevenueBreakdownProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-card/80 backdrop-blur-xl border-border/50">
            <CardHeader>
              <div className="h-6 bg-muted/50 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/50 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Generate revenue data based on timeframe
  const generateRevenueData = () => {
    const baseEarnings = data.stats?.totalEarnings || 0;
    const breakdown = data.revenueBreakdown || { subscriptions: 0, tips: 0, liveStreamPurchases: 0, messages: 0 };
    
    let periods: Date[] = [];
    let dataPoints = 0;
    
    switch (timeframe) {
      case '1D':
        dataPoints = 24;
        periods = Array.from({ length: dataPoints }, (_, i) => new Date(Date.now() - (23 - i) * 60 * 60 * 1000));
        break;
      case '1W':
        dataPoints = 7;
        periods = Array.from({ length: dataPoints }, (_, i) => subDays(new Date(), 6 - i));
        break;
      case '1M':
        dataPoints = 30;
        periods = Array.from({ length: dataPoints }, (_, i) => subDays(new Date(), 29 - i));
        break;
      case '1Y':
        dataPoints = 12;
        periods = Array.from({ length: dataPoints }, (_, i) => subMonths(new Date(), 11 - i));
        break;
      case 'ALL':
        dataPoints = 24; // 2 years of monthly data
        periods = Array.from({ length: dataPoints }, (_, i) => subMonths(new Date(), 23 - i));
        break;
    }

    return periods.map((date, index) => {
      const timeMultiplier = timeframe === '1D' ? 0.04 : timeframe === '1W' ? 0.14 : timeframe === '1M' ? 1 : 12;
      const variance = 0.8 + Math.random() * 0.4; // 80-120% variance
      
      return {
        date: timeframe === '1D' ? format(date, 'HH:mm') : format(date, timeframe === '1Y' || timeframe === 'ALL' ? 'MMM yyyy' : 'MMM dd'),
        subscriptions: Math.floor(breakdown.subscriptions * timeMultiplier * variance / dataPoints),
        tips: Math.floor(breakdown.tips * timeMultiplier * variance / dataPoints),
        ppv: Math.floor(breakdown.messages * timeMultiplier * variance / dataPoints),
        streams: Math.floor(breakdown.liveStreamPurchases * timeMultiplier * variance / dataPoints),
        total: 0
      };
    }).map(item => ({
      ...item,
      total: item.subscriptions + item.tips + item.ppv + item.streams
    }));
  };

  const revenueData = generateRevenueData();
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.total, 0);
  const previousPeriodRevenue = totalRevenue * (0.85 + Math.random() * 0.2); // Simulate previous period
  const growthRate = previousPeriodRevenue > 0 ? ((totalRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100 : 0;

  // Calculate period totals
  const periodTotals = {
    subscriptions: revenueData.reduce((sum, item) => sum + item.subscriptions, 0),
    tips: revenueData.reduce((sum, item) => sum + item.tips, 0),
    ppv: revenueData.reduce((sum, item) => sum + item.ppv, 0),
    streams: revenueData.reduce((sum, item) => sum + item.streams, 0)
  };

  const revenueCategories = [
    { name: 'Subscriptions', value: periodTotals.subscriptions, color: '#8B5CF6', icon: '👑' },
    { name: 'Tips', value: periodTotals.tips, color: '#EC4899', icon: '💝' },
    { name: 'PPV Content', value: periodTotals.ppv, color: '#10B981', icon: '🔒' },
    { name: 'Live Streams', value: periodTotals.streams, color: '#F59E0B', icon: '📹' }
  ].filter(cat => cat.value > 0);

  const getTimeframePeriod = () => {
    switch (timeframe) {
      case '1D': return 'Last 24 Hours';
      case '1W': return 'Last 7 Days';
      case '1M': return 'Last 30 Days';
      case '1Y': return 'Last Year';
      case 'ALL': return 'All Time';
    }
  };

  return (
    <div className="space-y-6">
      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="h-8 w-8 text-emerald-500" />
              <Badge className={`${growthRate > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {growthRate > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {Math.abs(growthRate).toFixed(1)}%
              </Badge>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground mb-1">
                ${totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Revenue ({getTimeframePeriod()})</p>
            </div>
          </CardContent>
        </Card>

        {revenueCategories.slice(0, 3).map((category, index) => (
          <Card key={category.name} className="bg-card/80 backdrop-blur-xl border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl">{category.icon}</div>
                <Badge className="bg-primary/20 text-primary">
                  {totalRevenue > 0 ? ((category.value / totalRevenue) * 100).toFixed(1) : 0}%
                </Badge>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground mb-1">
                  ${category.value.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">{category.name}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Timeline Chart */}
      <Card className="bg-card/80 backdrop-blur-xl border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-primary" />
            Revenue Timeline - {getTimeframePeriod()}
            <Badge className="bg-primary/20 text-primary border-primary/30 ml-auto">
              <Calendar className="h-3 w-3 mr-1" />
              {timeframe}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }} 
                formatter={(value: number, name: string) => [`$${value}`, name]}
              />
              <Area 
                type="monotone" 
                dataKey="total" 
                stroke="#8B5CF6" 
                fillOpacity={1} 
                fill="url(#colorTotal)" 
                strokeWidth={2}
                name="Total Revenue"
              />
              <Area 
                type="monotone" 
                dataKey="subscriptions" 
                stroke="#10B981" 
                fillOpacity={1} 
                fill="url(#colorSubs)" 
                strokeWidth={1}
                name="Subscriptions"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Daily/Hourly Breakdown */}
      <Card className="bg-card/80 backdrop-blur-xl border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-accent" />
            Revenue by Category - {getTimeframePeriod()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData.slice(-10)}> {/* Show last 10 periods */}
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }} 
                formatter={(value: number, name: string) => [`$${value}`, name]}
              />
              <Bar dataKey="subscriptions" stackId="a" fill="#8B5CF6" name="Subscriptions" />
              <Bar dataKey="tips" stackId="a" fill="#EC4899" name="Tips" />
              <Bar dataKey="ppv" stackId="a" fill="#10B981" name="PPV Content" />
              <Bar dataKey="streams" stackId="a" fill="#F59E0B" name="Live Streams" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
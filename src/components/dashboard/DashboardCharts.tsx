
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { subDays } from "date-fns";
import { motion } from "framer-motion";

interface DashboardChartsProps {
  engagementData: any[];
  contentTypeData: any[];
  earningsData: any[];
  onDateRangeChange: (range: { from: Date; to: Date }) => void;
  showOnlyEarnings?: boolean;
  showOnlyEngagement?: boolean;
}

export function DashboardCharts({ 
  engagementData, 
  contentTypeData, 
  earningsData, 
  onDateRangeChange,
  showOnlyEarnings = false,
  showOnlyEngagement = false
}: DashboardChartsProps) {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const handleDateRangeChange = (range: { from: Date | null; to: Date | null }) => {
    if (range.from && range.to) {
      setDateRange({ from: range.from, to: range.to });
      onDateRangeChange({ from: range.from, to: range.to });
    }
  };

  // Colors for the pie chart
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

  const EarningsChart = () => (
    <Card className="p-6 glass-card shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Earnings Over Time</h3>
          <p className="text-sm text-luxury-muted">Track your income growth</p>
        </div>
        {!showOnlyEarnings && !showOnlyEngagement && (
          <DateRangePicker
            from={dateRange.from}
            to={dateRange.to}
            onSelect={handleDateRangeChange}
          />
        )}
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={earningsData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="date" stroke="#888" />
            <YAxis stroke="#888" tickFormatter={(value) => `$${value}`} />
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Earnings']}
              contentStyle={{ background: 'rgba(22, 22, 30, 0.9)', border: '1px solid #333', borderRadius: '4px' }}
              labelStyle={{ color: '#ccc' }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              strokeWidth={2}
              name="Earnings"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-luxury-muted">Total Earnings (Period)</p>
            <p className="text-xl font-bold">
              ${earningsData.reduce((sum, item) => sum + Number(item.amount), 0).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-luxury-muted">Average Daily</p>
            <p className="text-xl font-bold">
              ${(earningsData.reduce((sum, item) => sum + Number(item.amount), 0) / (earningsData.length || 1)).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );

  const EngagementChart = () => (
    <Card className="p-6 glass-card shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Audience Engagement</h3>
          <p className="text-sm text-luxury-muted">Track interactions with your content</p>
        </div>
        {!showOnlyEarnings && !showOnlyEngagement && (
          <DateRangePicker
            from={dateRange.from}
            to={dateRange.to}
            onSelect={handleDateRangeChange}
          />
        )}
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={engagementData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="date" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip
              formatter={(value: number) => [value, 'Interactions']}
              contentStyle={{ background: 'rgba(22, 22, 30, 0.9)', border: '1px solid #333', borderRadius: '4px' }}
              labelStyle={{ color: '#ccc' }}
            />
            <Bar dataKey="count" fill="#82ca9d" name="Interactions" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-luxury-muted">Total Interactions</p>
            <p className="text-xl font-bold">
              {engagementData.reduce((sum, item) => sum + Number(item.count), 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-luxury-muted">Avg Engagement Rate</p>
            <p className="text-xl font-bold">
              5.4%
            </p>
          </div>
        </div>
      </div>
    </Card>
  );

  const ContentDistributionChart = () => (
    <Card className="p-6 glass-card shadow-md">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-1">Content Distribution</h3>
        <p className="text-sm text-luxury-muted">Breakdown of your content types</p>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={contentTypeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {contentTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [value, 'Items']}
              contentStyle={{ background: 'rgba(22, 22, 30, 0.9)', border: '1px solid #333', borderRadius: '4px' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        {contentTypeData.map((item, index) => (
          <div key={index} className="text-center">
            <div
              className="h-2 w-full rounded-full mb-1"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <p className="text-sm font-medium">{item.name}</p>
            <p className="text-lg font-bold">{item.value}</p>
          </div>
        ))}
      </div>
    </Card>
  );

  if (showOnlyEarnings) {
    return <EarningsChart />;
  }

  if (showOnlyEngagement) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EngagementChart />
        <ContentDistributionChart />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-8"
    >
      <Tabs defaultValue="earnings">
        <TabsList className="bg-luxury-darker/50 w-full max-w-md mx-auto mb-6">
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="content">Content Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="earnings" className="mt-0">
          <EarningsChart />
        </TabsContent>

        <TabsContent value="engagement" className="mt-0">
          <EngagementChart />
        </TabsContent>

        <TabsContent value="content" className="mt-0">
          <ContentDistributionChart />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

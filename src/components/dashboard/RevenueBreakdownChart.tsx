
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { motion } from "framer-motion";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

interface RevenueBreakdownChartProps {
  data: {
    subscriptions: number;
    tips: number;
    liveStreamPurchases: number;
    messages: number;
  };
}

export function RevenueBreakdownChart({ data }: RevenueBreakdownChartProps) {
  const chartData = [
    { name: 'Subscriptions', value: data.subscriptions },
    { name: 'Tips', value: data.tips },
    { name: 'Live Streams', value: data.liveStreamPurchases },
    { name: 'Messages', value: data.messages },
  ].filter(item => item.value > 0);

  const totalRevenue = chartData.reduce((sum, item) => sum + item.value, 0);

  if (totalRevenue === 0) {
    return (
      <Card className="p-6 glass-card h-full">
        <h3 className="text-lg font-semibold mb-4">Revenue Breakdown</h3>
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-luxury-muted">No revenue data to display</p>
        </div>
      </Card>
    );
  }

  const formatPercentage = (value: number) => {
    return `${(value / totalRevenue * 100).toFixed(1)}%`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="h-full"
    >
      <Card className="p-6 glass-card h-full">
        <h3 className="text-lg font-semibold mb-2">Revenue Breakdown</h3>
        <p className="text-sm text-luxury-muted mb-4">
          Source distribution of your earnings
        </p>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                contentStyle={{ background: 'rgba(22, 22, 30, 0.9)', border: '1px solid #333', borderRadius: '4px' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }} 
              />
              <span className="text-sm">{item.name}</span>
              <span className="ml-auto text-sm font-medium">${item.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

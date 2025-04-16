
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface RevenueBreakdownProps {
  data: {
    subscriptions: number;
    tips: number;
    liveStreamPurchases: number;
    messages: number;
  };
  isLoading: boolean;
}

export const RevenueBreakdown = ({ data, isLoading }: RevenueBreakdownProps) => {
  if (isLoading) {
    return (
      <Card className="col-span-1 md:col-span-2 h-[300px]">
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="animate-pulse w-full h-52 bg-luxury-darker/50 rounded-lg"></div>
        </CardContent>
      </Card>
    );
  }

  const chartData = [
    { name: 'Subscriptions', value: data.subscriptions },
    { name: 'Tips', value: data.tips },
    { name: 'Live Stream', value: data.liveStreamPurchases },
    { name: 'Messages', value: data.messages }
  ].filter(item => item.value > 0);

  const COLORS = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981'];

  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);
  const isEmpty = totalValue === 0;

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalValue) * 100).toFixed(1);
      
      return (
        <div className="p-2 bg-black/90 text-white text-xs rounded shadow">
          <p>{`${data.name}: $${data.value.toFixed(2)} (${percentage}%)`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-1 md:col-span-2 h-[300px]">
      <CardHeader>
        <CardTitle>Revenue Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="flex items-center justify-center h-[210px]">
            <p className="text-muted-foreground">No revenue data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={210}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={customTooltip} />
              <Legend 
                layout="vertical" 
                align="right" 
                verticalAlign="middle" 
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

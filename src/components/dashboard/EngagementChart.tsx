import { Card } from "@/components/ui/card";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface EngagementChartProps {
  data: any[];
}

export const EngagementChart = ({ data }: EngagementChartProps) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-luxury-dark to-luxury-dark/95 border-luxury-primary/20">
      <h3 className="text-xl font-bold mb-6 text-luxury-primary">Engagement Over Time</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis dataKey="date" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#8884d8" 
              name="Interactions"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
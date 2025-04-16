
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users } from 'lucide-react';

interface AudienceGroupsProps {
  isLoading: boolean;
  newSubscribers: number;
  returningSubscribers: number;
  vipFans: number;
  churnRate: number;
}

export const AudienceGroups = ({ 
  isLoading,
  newSubscribers, 
  returningSubscribers,
  vipFans,
  churnRate
}: AudienceGroupsProps) => {
  if (isLoading) {
    return (
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={18} />
            Audience Groups
          </CardTitle>
          <CardDescription>Breakdown of your audience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse h-40 bg-luxury-darker/50 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  const data = [
    { name: 'New', value: newSubscribers, color: '#8B5CF6' },
    { name: 'Returning', value: returningSubscribers, color: '#EC4899' },
    { name: 'VIP', value: vipFans, color: '#10B981' },
  ];

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users size={18} />
          Audience Groups
        </CardTitle>
        <CardDescription>
          Breakdown of your audience types
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.every(item => item.value === 0) ? (
          <div className="text-center py-8 text-muted-foreground">
            No audience data available
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data} layout="vertical" margin={{ right: 25 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal opacity={0.2} />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  width={80} 
                />
                <Tooltip
                  formatter={(value: number) => [value, 'Count']}
                  contentStyle={{ 
                    background: 'rgba(17, 24, 39, 0.9)', 
                    border: 'none', 
                    borderRadius: '4px', 
                    color: '#f3f4f6' 
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-between items-center mt-2 pt-4 border-t">
              <div>
                <p className="text-sm font-medium">Churn Rate</p>
              </div>
              <div className={`text-sm font-medium ${churnRate > 15 ? 'text-red-500' : churnRate > 5 ? 'text-amber-500' : 'text-green-500'}`}>
                {churnRate.toFixed(1)}%
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

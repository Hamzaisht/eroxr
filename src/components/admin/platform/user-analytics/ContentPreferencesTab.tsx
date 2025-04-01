
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Video,
  Heart,
  MessageSquare,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TabProps } from "./types";

export const ContentPreferencesTab: React.FC<TabProps> = ({ analytics }) => {
  // Chart colors
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];
  
  return (
    <div className="space-y-6">
      <Card className="bg-[#0D1117]/60 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg">Content Type Preferences</CardTitle>
          <CardDescription>
            Distribution of content types the user engages with
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={analytics.contentDistribution}
                margin={{ top: 20, right: 30, left: 100, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.1} />
                <XAxis type="number" />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  formatter={(value) => [`${value} interactions`, ""]}
                />
                <Bar 
                  dataKey="value" 
                  name="Interactions" 
                  radius={[0, 4, 4, 0]}
                >
                  {analytics.contentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#0D1117]/60 border-white/10">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Feed Posts</CardTitle>
              <Video className="h-5 w-5 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{analytics.contentDistribution[0].value}</div>
            <div className="text-sm text-muted-foreground">
              interactions with standard posts
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0D1117]/60 border-white/10">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Dating Ads</CardTitle>
              <Heart className="h-5 w-5 text-pink-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{analytics.contentDistribution[1].value}</div>
            <div className="text-sm text-muted-foreground">
              interactions with dating profiles
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0D1117]/60 border-white/10">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Direct Messages</CardTitle>
              <MessageSquare className="h-5 w-5 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{analytics.contentDistribution[2].value}</div>
            <div className="text-sm text-muted-foreground">
              interactions with private messages
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

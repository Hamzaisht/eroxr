import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Eye,
  Image,
  MessageSquare,
  DollarSign,
} from "lucide-react";
import { PieChart, Pie, ResponsiveContainer, Tooltip, Legend, Cell } from "recharts";
import { format } from "date-fns";
import { TabProps } from "./types";

export const OverviewTab: React.FC<TabProps> = ({ analytics }) => {
  // Chart colors
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];
  
  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#0D1117]/60 border-white/10">
          <CardHeader className="pb-2">
            <CardDescription>Total Activity</CardDescription>
            <CardTitle className="text-3xl flex items-center">
              <div className="p-2 mr-3 rounded-full bg-blue-900/20">
                <Eye className="h-5 w-5 text-blue-400" />
              </div>
              {analytics.totalViews + analytics.totalLikes + analytics.totalComments}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {analytics.totalViews} views · {analytics.totalLikes} likes · {analytics.totalComments} comments
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0D1117]/60 border-white/10">
          <CardHeader className="pb-2">
            <CardDescription>Content Created</CardDescription>
            <CardTitle className="text-3xl flex items-center">
              <div className="p-2 mr-3 rounded-full bg-green-900/20">
                <Image className="h-5 w-5 text-green-400" />
              </div>
              {analytics.totalPosts}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {analytics.totalPosts > 0 
                ? `Avg. ${Math.round((analytics.totalLikes + analytics.totalComments) / analytics.totalPosts)} engagements per post`
                : 'No posts created during this period'}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0D1117]/60 border-white/10">
          <CardHeader className="pb-2">
            <CardDescription>Messages Sent</CardDescription>
            <CardTitle className="text-3xl flex items-center">
              <div className="p-2 mr-3 rounded-full bg-purple-900/20">
                <MessageSquare className="h-5 w-5 text-purple-400" />
              </div>
              {analytics.totalMessages}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              To {analytics.uniqueMessageRecipients} unique recipients
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0D1117]/60 border-white/10">
          <CardHeader className="pb-2">
            <CardDescription>Tips Sent</CardDescription>
            <CardTitle className="text-3xl flex items-center">
              <div className="p-2 mr-3 rounded-full bg-amber-900/20">
                <DollarSign className="h-5 w-5 text-amber-400" />
              </div>
              {analytics.tipsAmount.toFixed(2)} SEK
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Last active: {analytics.lastActive 
                ? format(new Date(analytics.lastActive), "MMM d, yyyy") 
                : 'Unknown'}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main content distribution chart */}
      <Card className="bg-[#0D1117]/60 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg">Usage Distribution</CardTitle>
          <CardDescription>
            How this user is interacting with different sections of the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-[300px] flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.contentDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {analytics.contentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} interactions`, ""]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

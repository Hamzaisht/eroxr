import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Eye,
  Heart,
  MessageSquare,
  DollarSign,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";
import { format } from "date-fns";
import { TabProps } from "./types";

export const ActivityTimelineTab: React.FC<TabProps> = ({ analytics, timeRange }) => {
  return (
    <div className="space-y-6">
      <Card className="bg-[#0D1117]/60 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg">Activity Timeline</CardTitle>
          <CardDescription>
            User's engagement over the last {timeRange} days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analytics.timeline}
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => format(new Date(date), "MMM d")}
                  tickMargin={10}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => {
                    const nameStr = typeof name === 'string' ? name : String(name);
                    return [value, nameStr.charAt(0).toUpperCase() + nameStr.slice(1)];
                  }}
                  labelFormatter={(date) => format(new Date(date as string), "MMMM d, yyyy")}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                  name="Views"
                />
                <Line 
                  type="monotone" 
                  dataKey="likes" 
                  stroke="#82ca9d"
                  name="Likes" 
                />
                <Line 
                  type="monotone" 
                  dataKey="comments" 
                  stroke="#ffc658"
                  name="Comments" 
                />
                <Line 
                  type="monotone" 
                  dataKey="messages" 
                  stroke="#ff8042"
                  name="Messages" 
                />
                <Line 
                  type="monotone" 
                  dataKey="posts" 
                  stroke="#0088FE"
                  name="Posts" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-[#0D1117]/60 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg">Daily Activity</CardTitle>
            <CardDescription>
              When this user is most active
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.timeline.slice(0, 7)} // Last 7 days regardless of time range
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => format(new Date(date), "EEE")}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => {
                      const nameStr = typeof name === 'string' ? name : String(name);
                      return [value, nameStr.charAt(0).toUpperCase() + nameStr.slice(1)];
                    }}
                    labelFormatter={(date) => format(new Date(date as string), "EEEE, MMMM d")}
                  />
                  <Legend />
                  <Bar 
                    dataKey="views" 
                    fill="#8884d8" 
                    name="Views" 
                  />
                  <Bar 
                    dataKey="likes" 
                    fill="#82ca9d" 
                    name="Likes" 
                  />
                  <Bar 
                    dataKey="messages" 
                    fill="#ff8042" 
                    name="Messages" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0D1117]/60 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg">Activity Stats</CardTitle>
            <CardDescription>
              Summary of user's recent platform interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Last Active</span>
                </div>
                <span className="font-medium">
                  {analytics.lastActive 
                    ? format(new Date(analytics.lastActive), "PPp")
                    : 'Unknown'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Total Views</span>
                </div>
                <span className="font-medium">{analytics.totalViews}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Total Likes</span>
                </div>
                <span className="font-medium">{analytics.totalLikes}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Unique Chats</span>
                </div>
                <span className="font-medium">{analytics.uniqueMessageRecipients}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Tips Sent</span>
                </div>
                <span className="font-medium">{analytics.tipsAmount.toFixed(2)} SEK</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

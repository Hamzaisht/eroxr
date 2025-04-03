
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { useAdminLogs } from "@/hooks/useAdminLogs";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, AlertTriangle, CheckCircle, Clock, User, AlertCircle, Ban, Eye, Pencil } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const AdminLogs = () => {
  const [timeWindow, setTimeWindow] = useState<number>(30);
  const { logs, isLoading, error } = useAdminLogs(timeWindow);
  
  const getActionIcon = (action: string, actionType: string) => {
    if (action.includes('ban')) return <Ban className="h-4 w-4 text-red-400" />;
    if (action.includes('delete')) return <AlertCircle className="h-4 w-4 text-red-400" />;
    if (action.includes('ghost')) return <Eye className="h-4 w-4 text-purple-400" />;
    if (action.includes('edit')) return <Pencil className="h-4 w-4 text-blue-400" />;
    if (action.includes('flag')) return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
    if (action.includes('restore')) return <CheckCircle className="h-4 w-4 text-green-400" />;
    
    if (actionType === 'moderation') return <Shield className="h-4 w-4 text-orange-400" />;
    if (actionType === 'user_moderation') return <User className="h-4 w-4 text-blue-400" />;
    
    return <Clock className="h-4 w-4 text-gray-400" />;
  };
  
  const getBadgeColor = (action: string): string => {
    if (action.includes('ban') || action.includes('delete')) return "destructive";
    if (action.includes('flag')) return "yellow";
    if (action.includes('ghost')) return "purple";
    if (action.includes('restore') || action.includes('approve')) return "green";
    if (action.includes('edit')) return "blue";
    return "secondary";
  };
  
  const formatActionLabel = (action: string): string => {
    return action
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Logs</h1>
        <Select
          value={timeWindow.toString()}
          onValueChange={(value) => setTimeWindow(parseInt(value, 10))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time Window" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Last 24 Hours</SelectItem>
            <SelectItem value="7">Last 7 Days</SelectItem>
            <SelectItem value="30">Last 30 Days</SelectItem>
            <SelectItem value="90">Last 3 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {error && (
        <div className="p-4 bg-red-900/20 border border-red-700 rounded-md text-red-300">
          <AlertCircle className="h-5 w-5 mb-1" />
          <p>Error loading admin logs: {error.message}</p>
        </div>
      )}
      
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="p-4">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-1/4 mt-2" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : logs.length === 0 ? (
          <Card>
            <CardContent className="p-8 flex flex-col items-center justify-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-400 text-center">No admin logs found for the selected time period.</p>
            </CardContent>
          </Card>
        ) : (
          logs.map((log) => (
            <Card key={log.id} className="overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getActionIcon(log.action, log.action_type)}
                    <CardTitle className="text-base">
                      {formatActionLabel(log.action)}
                    </CardTitle>
                    <Badge variant={getBadgeColor(log.action) as any} className="ml-2">
                      {log.action_type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-400">
                    {format(new Date(log.created_at), 'MMM d, yyyy HH:mm:ss')}
                  </div>
                </div>
                <CardDescription className="mt-1">
                  {log.target_type && (
                    <span className="capitalize">
                      {log.target_type} ID: {log.target_id?.slice(0, 8)}...
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10 border border-white/10">
                    <AvatarImage src={log.profiles?.avatar_url} alt={log.profiles?.username || 'Admin'} />
                    <AvatarFallback>{(log.profiles?.username?.charAt(0) || 'A').toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{log.profiles?.username || 'Admin'}</p>
                    {log.details && log.details.username && (
                      <p className="text-xs text-gray-400">
                        Target: {log.details.username}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

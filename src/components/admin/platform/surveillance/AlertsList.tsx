

import { format } from "date-fns";
import { AlertTriangle, Clock } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LiveAlert } from "../user-analytics/types";

interface AlertsListProps {
  alerts: LiveAlert[];
  isLoading: boolean;
}

export const AlertsList = ({ alerts, isLoading }: AlertsListProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="h-8 w-8 animate-spin text-purple-400 border-2 border-current border-t-transparent rounded-full" />
      </div>
    );
  }
  
  if (alerts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <AlertTriangle className="h-10 w-10 mx-auto mb-2 opacity-50" />
        <p>No active alerts at the moment</p>
      </div>
    );
  }
  
  // Function to determine alert badge color based on severity
  const getAlertBadgeClass = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return "bg-red-900/30 text-red-300 border-red-800";
      case 'high':
        return "bg-orange-900/30 text-orange-300 border-orange-800";
      case 'medium':
        return "bg-yellow-900/30 text-yellow-300 border-yellow-800";
      case 'low':
        return "bg-blue-900/30 text-blue-300 border-blue-800";
      default:
        return "bg-gray-900/30 text-gray-300 border-gray-800";
    }
  };
  
  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div 
          key={alert.id} 
          className="flex items-start gap-3 p-3 rounded-lg bg-[#161B22] hover:bg-[#1C222B] transition-colors"
        >
          <Avatar>
            <AvatarImage src={alert.avatar_url || undefined} />
            <AvatarFallback>{alert.username?.[0]?.toUpperCase() || '?'}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{alert.username}</h3>
              <Badge 
                variant="outline" 
                className={`font-normal text-xs ${getAlertBadgeClass(alert.severity)}`}
              >
                {alert.severity.toUpperCase()}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-400">
              <span className="font-medium">{alert.type}:</span> {alert.reason}
            </p>
            
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>
                {format(new Date(alert.created_at), 'yyyy-MM-dd HH:mm:ss')}
              </span>
              <span className="mx-1">•</span>
              <span className="capitalize">
                {alert.content_type}
              </span>
            </div>
          </div>
          
          <Button 
            size="sm" 
            variant="ghost" 
            className="bg-red-900/20 hover:bg-red-800/30 text-red-300 border-red-800/50"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Review
          </Button>
        </div>
      ))}
    </div>
  );
};


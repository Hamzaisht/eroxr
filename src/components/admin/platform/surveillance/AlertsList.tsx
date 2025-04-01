
import { format } from "date-fns";
import { Clock, Info, Flag, AlertTriangle, ShieldAlert } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LiveAlert } from "../user-analytics/types";

interface AlertsListProps {
  alerts: LiveAlert[];
  isLoading: boolean;
}

export const AlertsList = ({ alerts, isLoading }: AlertsListProps) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'flag':
        return <Flag className="h-4 w-4 text-orange-400" />;
      case 'report':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'risk':
        return <ShieldAlert className="h-4 w-4 text-yellow-400" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'stream':
        return 'Livestream';
      case 'call':
        return 'Call';
      case 'message':
        return 'Message';
      case 'post':
        return 'Post';
      case 'ad':
        return 'Ad';
      default:
        return type;
    }
  };
  
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge className="bg-red-600">High</Badge>;
      case 'medium':
        return <Badge className="bg-orange-500">Medium</Badge>;
      case 'low':
        return <Badge className="bg-yellow-500">Low</Badge>;
      default:
        return <Badge>{severity}</Badge>;
    }
  };
  
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
        <p>No alerts in the last 15 minutes</p>
      </div>
    );
  }
  
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
              <div className="flex items-center gap-1">
                {getAlertIcon(alert.type)}
                <span className="text-xs text-gray-400">
                  {alert.type === 'flag' ? 'Flagged' : 
                   alert.type === 'report' ? 'Reported' : 'Risk Alert'}
                </span>
              </div>
              {getSeverityBadge(alert.severity)}
            </div>
            
            <p className="text-sm text-gray-400">
              {getContentTypeLabel(alert.content_type)} • {alert.reason}
            </p>
            
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>{format(new Date(alert.created_at), 'HH:mm:ss')}</span>
            </div>
          </div>
          
          <Button 
            size="sm" 
            variant="ghost" 
            className="bg-red-900/20 hover:bg-red-800/30 text-red-300 border-red-800/50"
          >
            <ShieldAlert className="h-4 w-4 mr-2" />
            Review
          </Button>
        </div>
      ))}
    </div>
  );
};

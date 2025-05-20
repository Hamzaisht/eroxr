
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { LiveAlert } from "@/types/alerts";
import { LiveAlert as SurveillanceAlert } from "@/types/surveillance";

interface AlertsListProps {
  alerts: LiveAlert[] | SurveillanceAlert[];
  isLoading: boolean;
  onSelect?: (alert: LiveAlert | SurveillanceAlert) => void;
}

export function AlertsList({ alerts, isLoading, onSelect }: AlertsListProps) {
  // Get severity class
  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/10 border-red-500/50';
      case 'high':
        return 'bg-orange-500/10 border-orange-500/50';
      case 'medium':
        return 'bg-yellow-500/10 border-yellow-500/50';
      case 'low':
        return 'bg-blue-500/10 border-blue-500/50';
      default:
        return 'bg-gray-500/10 border-gray-500/50';
    }
  };
  
  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Unknown time";
    }
  };
  
  // Get severity badge color
  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'warning';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="ml-2">Loading alerts...</p>
      </div>
    );
  }
  
  if (!alerts || alerts.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No alerts found</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <Card 
          key={alert.id}
          className={`p-4 border ${getSeverityClass(alert.severity)} ${
            !alert.isRead ? 'ring-1 ring-primary/20' : ''
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={getSeverityBadgeVariant(alert.severity)}>
                  {alert.severity}
                </Badge>
                <h3 className="font-medium">{alert.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{alert.description}</p>
              <div className="text-xs text-muted-foreground mt-2">
                <span>{formatRelativeTime(alert.timestamp)}</span>
                {alert.source && (
                  <>
                    <span className="mx-1">•</span>
                    <span>Source: {alert.source}</span>
                  </>
                )}
              </div>
            </div>
            {onSelect && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onSelect(alert)}
              >
                View Details
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

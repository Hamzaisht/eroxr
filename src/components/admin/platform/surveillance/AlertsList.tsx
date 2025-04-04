
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { LiveAlert } from "@/types/alerts";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface AlertsListProps {
  alerts: LiveAlert[];
  isLoading: boolean;
  onSelect?: (alert: LiveAlert) => void;
}

export const AlertsList = ({ alerts, isLoading, onSelect }: AlertsListProps) => {
  const handleSelect = (alert: LiveAlert) => {
    if (onSelect) {
      onSelect(alert);
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Alert</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alerts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                No alerts at this time
              </TableCell>
            </TableRow>
          ) : (
            alerts.map((alert) => (
              <TableRow key={alert.id} className={alert.urgent ? "bg-red-500/10" : undefined}>
                <TableCell>
                  <Badge variant={alert.severity === "high" ? "destructive" : "secondary"}>
                    {alert.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {alert.title}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {alert.message}
                  </div>
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSelect(alert)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

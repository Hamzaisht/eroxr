import { useGhostAlerts } from "./hooks/useGhostAlerts";
import { LiveAlert } from "@/types/alerts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, Flag, AlertTriangle, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchFilterBar, SearchFilter } from "./components/SearchFilterBar";

interface AlertsListProps {
  onViewContent: (alert: LiveAlert) => void;
}

export const AlertsList = ({ onViewContent }: AlertsListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilter>({ query: "" });
  const { alerts, isLoading, error, refreshAlerts } = useGhostAlerts(filters);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setFilters(prev => ({ ...prev, query: query }));
  };

  const handleSearch = (searchFilters: SearchFilter) => {
    setFilters(searchFilters);
  };

  const AlertIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "flag":
        return <Flag className="h-4 w-4 mr-2 text-red-500" />;
      case "alert":
        return <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 mr-2 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Live Alerts</h2>
        <SearchFilterBar
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
          onRefresh={refreshAlerts}
          placeholder="Search alerts..."
        />
      </div>
      
      <Card className="bg-black/20 border-white/10">
        <ScrollArea className="h-[400px] rounded-md">
          <div className="p-4 space-y-4">
            {isLoading ? (
              <>
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </>
            ) : error ? (
              <div className="text-red-500">Error: {error.message}</div>
            ) : alerts.length === 0 ? (
              <div className="text-muted-foreground">No alerts found.</div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 rounded-md hover:bg-secondary/50"
                >
                  <div className="flex items-center">
                    <AlertIcon type={alert.type} />
                    <div>
                      <h3 className="text-sm font-medium">{alert.message}</h3>
                      <p className="text-xs text-muted-foreground">
                        Content ID: {alert.content_id}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {alert.severity && (
                      <Badge variant="secondary">{alert.severity}</Badge>
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onViewContent(alert)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};


import { useState } from "react";
import { LiveAlert } from "./types";
import { AlertCircle, Search, Filter, Ban, Flag, Eye } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { SearchFilterBar, SearchFilter } from "./components/SearchFilterBar";

interface AlertsListProps {
  alerts: LiveAlert[];
  isLoading: boolean;
}

export const AlertsList = ({ alerts, isLoading }: AlertsListProps) => {
  const [filteredAlerts, setFilteredAlerts] = useState<LiveAlert[]>(alerts);
  
  const handleSearch = (filters: SearchFilter) => {
    const filtered = alerts.filter(alert => {
      // Filter by username
      if (filters.username && !alert.username.toLowerCase().includes(filters.username.toLowerCase())) {
        return false;
      }
      
      // Filter by user ID
      if (filters.userId && alert.user_id !== filters.userId) {
        return false;
      }
      
      // Filter by type
      if (filters.type && filters.type !== 'all' && alert.alert_type !== filters.type) {
        return false;
      }
      
      // Filter by status
      if (filters.status && filters.status !== 'all' && alert.status !== filters.status) {
        return false;
      }
      
      return true;
    });
    
    setFilteredAlerts(filtered);
  };
  
  // Update filtered alerts when original alerts change
  if (alerts !== filteredAlerts && filteredAlerts.length === 0 && alerts.length > 0) {
    setFilteredAlerts(alerts);
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="h-8 w-8 animate-spin text-purple-400 border-2 border-current border-t-transparent rounded-full" />
      </div>
    );
  }
  
  if (alerts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 bg-[#161B22] rounded-lg">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-12 w-12 opacity-50" />
        </div>
        <p className="text-lg font-medium">No alerts detected</p>
        <p className="mt-2 text-sm text-gray-500">
          Platform alerts will appear here when triggered
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">System Alerts</h2>
        <Badge variant="destructive" className="font-normal">
          {alerts.length} Alert{alerts.length !== 1 ? 's' : ''}
        </Badge>
      </div>
      
      <SearchFilterBar
        onSearch={handleSearch}
        placeholder="Search alerts by username or ID..."
        availableTypes={[
          { value: 'all', label: 'All Types' },
          { value: 'content', label: 'Content' },
          { value: 'user', label: 'User' },
          { value: 'system', label: 'System' },
          { value: 'security', label: 'Security' }
        ]}
        availableStatuses={[
          { value: 'all', label: 'All Status' },
          { value: 'new', label: 'New' },
          { value: 'acknowledged', label: 'Acknowledged' },
          { value: 'resolved', label: 'Resolved' }
        ]}
      />
      
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8 text-gray-400 bg-[#161B22] rounded-lg">
            <p className="text-sm">No alerts match your search criteria</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <Alert 
              key={alert.id} 
              className={
                alert.severity === 'high' 
                  ? 'bg-red-900/20 border-red-800 text-red-300'
                  : alert.severity === 'medium'
                  ? 'bg-yellow-900/20 border-yellow-800 text-yellow-300'
                  : 'bg-blue-900/20 border-blue-800 text-blue-300'
              }
            >
              <div className="flex flex-col md:flex-row justify-between w-full gap-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 mt-0.5" />
                  <div>
                    <div className="font-medium mb-1">{alert.title}</div>
                    <div className="text-sm opacity-90 mb-2">{alert.message}</div>
                    
                    <div className="flex flex-wrap gap-3 items-center text-xs opacity-75">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={alert.avatar_url || undefined} alt={alert.username} />
                          <AvatarFallback>{alert.username.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span>{alert.username}</span>
                      </div>
                      
                      <Badge variant="outline" className="font-normal text-xs">
                        {alert.alert_type}
                      </Badge>
                      
                      <span>{format(new Date(alert.created_at), 'MMM d, yyyy HH:mm')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 self-end md:self-start">
                  <Button size="sm" variant="ghost" className="h-8">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className={
                      alert.severity === 'high' 
                        ? 'text-red-400 hover:text-red-300 hover:bg-red-900/30' 
                        : 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/30'
                    }
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Flag
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Block
                  </Button>
                </div>
              </div>
            </Alert>
          ))
        )}
      </div>
    </div>
  );
};

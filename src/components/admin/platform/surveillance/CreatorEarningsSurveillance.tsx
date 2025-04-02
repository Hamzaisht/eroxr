import { useState } from "react";
import { useCreatorEarnings } from "./hooks/useCreatorEarnings";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, ExternalLink, Ban, DollarSign } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSurveillance } from "./SurveillanceContext";
import { SearchFilterBar, SearchFilter } from "./components/SearchFilterBar";

export const CreatorEarningsSurveillance = () => {
  const { isRefreshing, handleRefresh } = useSurveillance();
  const { creatorEarnings, isLoading, error } = useCreatorEarnings();
  const [filteredEarnings, setFilteredEarnings] = useState(creatorEarnings);
  
  const handleSearch = (filters: SearchFilter) => {
    const filtered = creatorEarnings.filter(earning => {
      // Filter by username
      if (filters.username && !earning.username.toLowerCase().includes(filters.username.toLowerCase())) {
        return false;
      }
      
      // Filter by user ID
      if (filters.userId && earning.user_id !== filters.userId) {
        return false;
      }
      
      // Filter by type
      if (filters.type && filters.type !== 'all' && earning.source !== filters.type) {
        return false;
      }
      
      // Filter by status
      if (filters.status && filters.status !== 'all' && earning.status !== filters.status) {
        return false;
      }
      
      return true;
    });
    
    setFilteredEarnings(filtered);
  };
  
  // Update filtered earnings when original earnings change
  if (creatorEarnings !== filteredEarnings && !filteredEarnings.length && creatorEarnings.length) {
    setFilteredEarnings(creatorEarnings);
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="h-8 w-8 animate-spin text-purple-400 border-2 border-current border-t-transparent rounded-full" />
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert className="bg-red-900/20 border-red-800 text-red-300">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Creator Earnings Surveillance</h2>
        <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <SearchFilterBar
        onSearch={handleSearch}
        placeholder="Search by creator username or ID..."
        availableTypes={[
          { value: 'all', label: 'All Sources' },
          { value: 'subscription', label: 'Subscriptions' },
          { value: 'ppv', label: 'PPV Content' },
          { value: 'tips', label: 'Tips' },
          { value: 'direct', label: 'Direct Purchase' }
        ]}
        availableStatuses={[
          { value: 'all', label: 'All Status' },
          { value: 'pending', label: 'Pending' },
          { value: 'paid', label: 'Paid' },
          { value: 'declined', label: 'Declined' }
        ]}
      />
      
      <div className="rounded-md border">
        <Table>
          <TableCaption>A list of creator earnings from the platform.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Creator</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEarnings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32 text-gray-500">
                  No earnings match your search criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredEarnings.map((earning) => (
                <TableRow key={earning.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={earning.avatar_url || undefined} alt={earning.username} />
                        <AvatarFallback>{earning.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{earning.username}</p>
                        <p className="text-xs text-gray-500">{earning.user_id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {earning.source}
                    </Badge>
                    <div className="text-xs text-gray-500 mt-1">
                      {earning.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-green-400">
                      ${parseFloat(earning.amount).toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {earning.created_at && format(new Date(earning.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        earning.status === 'paid' 
                          ? 'bg-green-900/30 text-green-300 border-green-800' 
                          : earning.status === 'pending'
                          ? 'bg-yellow-900/30 text-yellow-300 border-yellow-800'
                          : 'bg-red-900/30 text-red-300 border-red-800'
                      }
                    >
                      {earning.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-400">
                        <DollarSign className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400">
                        <Ban className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

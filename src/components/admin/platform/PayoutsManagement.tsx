
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { 
  CreditCard, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  XCircle,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { LoadingState } from "@/components/ui/LoadingState";
import { useGhostMode } from "@/hooks/useGhostMode";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const PayoutsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const pageSize = 10;
  const { toast } = useToast();
  const { isGhostMode } = useGhostMode();

  // Fetch payout requests
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["payout-requests", currentPage, searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('payout_requests')
        .select(`
          *,
          profiles:creator_id (username, avatar_url, first_name, last_name)
        `);

      // Apply status filter
      if (statusFilter !== "all") {
        query = query.eq('status', statusFilter);
      }

      // Apply search filter
      if (searchTerm) {
        query = query.or(`profiles.username.ilike.%${searchTerm}%,profiles.first_name.ilike.%${searchTerm}%,profiles.last_name.ilike.%${searchTerm}%`);
      }

      // Apply pagination
      const from = (currentPage - 1) * pageSize;
      query = query
        .range(from, from + pageSize - 1)
        .order('requested_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching payout requests:", error);
        throw error;
      }

      return {
        payouts: data,
        totalCount: count || 0
      };
    },
  });

  const handleApprove = async () => {
    if (!selectedPayout) return;
    
    try {
      const { error } = await supabase
        .from('payout_requests')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          processed_by: (await supabase.auth.getSession()).data.session?.user.id,
        })
        .eq('id', selectedPayout.id);

      if (error) throw error;

      // Log the admin action
      await supabase.from('admin_audit_logs').insert({
        user_id: (await supabase.auth.getSession()).data.session?.user.id,
        action: 'payout_approved',
        details: {
          payout_id: selectedPayout.id,
          creator_id: selectedPayout.creator_id,
          amount: selectedPayout.amount,
          timestamp: new Date().toISOString()
        }
      });

      toast({
        title: "Payout Approved",
        description: `Payout of $${selectedPayout.final_amount} has been approved.`,
      });

      setApproveDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Error approving payout:", error);
      toast({
        title: "Action Failed",
        description: "There was an error processing your request.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    if (!selectedPayout) return;
    
    try {
      const { error } = await supabase
        .from('payout_requests')
        .update({
          status: 'rejected',
          processed_at: new Date().toISOString(),
          processed_by: (await supabase.auth.getSession()).data.session?.user.id,
        })
        .eq('id', selectedPayout.id);

      if (error) throw error;

      // Log the admin action
      await supabase.from('admin_audit_logs').insert({
        user_id: (await supabase.auth.getSession()).data.session?.user.id,
        action: 'payout_rejected',
        details: {
          payout_id: selectedPayout.id,
          creator_id: selectedPayout.creator_id,
          amount: selectedPayout.amount,
          timestamp: new Date().toISOString()
        }
      });

      toast({
        title: "Payout Rejected",
        description: `Payout request has been rejected.`,
      });

      setRejectDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Error rejecting payout:", error);
      toast({
        title: "Action Failed",
        description: "There was an error processing your request.",
        variant: "destructive",
      });
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil((data?.totalCount || 0) / pageSize);

  if (isLoading) {
    return <LoadingState message="Loading payout requests..." />;
  }

  return (
    <div className="space-y-4">
      {isGhostMode && (
        <div className="bg-purple-900/20 border border-purple-500/30 text-purple-300 px-4 py-3 rounded-lg flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-purple-400" />
          <span>Ghost Mode - Viewing Creator Payout Requests</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-auto sm:min-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search creators..."
            className="pl-10 bg-[#0D1117]/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] bg-[#0D1117]/50">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Requests</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-[#161B22]/50 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-luxury-primary" />
            Creator Payout Requests
          </CardTitle>
          <CardDescription>
            Review and process creator payout requests with 7% platform fee
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-white/10 overflow-hidden">
            <Table>
              <TableHeader className="bg-[#0D1117]">
                <TableRow>
                  <TableHead>Creator</TableHead>
                  <TableHead>Requested Amount</TableHead>
                  <TableHead>Platform Fee (7%)</TableHead>
                  <TableHead>Final Amount</TableHead>
                  <TableHead>Requested On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.payouts && data.payouts.length > 0 ? (
                  data.payouts.map((payout) => (
                    <TableRow key={payout.id} className="border-white/5 hover:bg-[#0D1117]/50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                            {payout.profiles?.avatar_url ? (
                              <img 
                                src={payout.profiles.avatar_url} 
                                alt={payout.profiles.username || 'Creator'} 
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <User className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold">{payout.profiles?.username || 'Unnamed Creator'}</div>
                            <div className="text-xs text-muted-foreground">
                              {payout.profiles?.first_name && payout.profiles?.last_name 
                                ? `${payout.profiles.first_name} ${payout.profiles.last_name}` 
                                : 'No name provided'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>${payout.amount.toFixed(2)}</TableCell>
                      <TableCell>${payout.platform_fee.toFixed(2)}</TableCell>
                      <TableCell>${payout.final_amount.toFixed(2)}</TableCell>
                      <TableCell>{format(new Date(payout.requested_at), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={payout.status === 'approved' ? 'default' : 
                                   payout.status === 'rejected' ? 'destructive' : 'outline'}
                          className={payout.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : ''}
                        >
                          {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {payout.status === 'pending' && (
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedPayout(payout);
                                setRejectDialogOpen(true);
                              }}
                              className="bg-red-900/20 hover:bg-red-900/40 border-red-900/40 text-red-500"
                            >
                              <XCircle className="mr-1 h-4 w-4" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedPayout(payout);
                                setApproveDialogOpen(true);
                              }}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Approve
                            </Button>
                          </div>
                        )}
                        {payout.status !== 'pending' && (
                          <Badge variant="outline" className="bg-[#0D1117]/50">
                            {payout.status === 'approved' ? 'Processed' : 'Rejected'}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p>No payout requests found for the selected filters</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, data?.totalCount || 0)} of {data?.totalCount || 0} requests
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="bg-[#0D1117]/50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="bg-[#0D1117]/50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Payout Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this payout request? 
              The creator will receive ${selectedPayout?.final_amount.toFixed(2)} after the 7% platform fee.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700"
            >
              Approve Payout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Payout Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this payout request?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReject}
              className="bg-red-600 hover:bg-red-700"
            >
              Reject Payout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

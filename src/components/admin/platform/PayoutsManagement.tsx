
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Eye, 
  Check, 
  X, 
  DollarSign,
  Calendar,
  ChevronLeft,
  ChevronRight,
  User,
  CreditCard,
  Clipboard
} from "lucide-react";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DateRangePicker, 
  DateRange 
} from "@/components/ui/date-range-picker";
import { useToast } from "@/hooks/use-toast";
import { LoadingState } from "@/components/ui/LoadingState";

export const PayoutsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayout, setSelectedPayout] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [actionNotes, setActionNotes] = useState("");
  const pageSize = 10;
  const platformFeePercentage = 7; // 7% platform fee
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch payout requests
  const { data, isLoading } = useQuery({
    queryKey: ["payout-requests", currentPage, statusFilter, dateRange, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('payout_requests')
        .select(`
          *,
          profiles:profiles!payout_requests_creator_id_fkey(
            username,
            avatar_url,
            first_name,
            last_name
          )
        `, { count: 'exact' });

      // Apply status filter
      if (statusFilter !== "all") {
        query = query.eq('status', statusFilter);
      }

      // Apply date range filter
      if (dateRange.from) {
        query = query.gte('requested_at', dateRange.from.toISOString());
      }
      if (dateRange.to) {
        // Add one day to include requests from the last day
        const endDate = new Date(dateRange.to);
        endDate.setDate(endDate.getDate() + 1);
        query = query.lt('requested_at', endDate.toISOString());
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
      
      if (error) throw error;
      return { payouts: data, totalCount: count || 0 };
    },
  });

  // Handle payout action
  const handlePayoutAction = useMutation({
    mutationFn: async ({ 
      id, 
      action, 
      notes = null 
    }: { 
      id: string; 
      action: 'approve' | 'reject'; 
      notes?: string | null 
    }) => {
      // Get the payout request
      const { data: payoutRequest } = await supabase
        .from('payout_requests')
        .select('*')
        .eq('id', id)
        .single();
      
      if (!payoutRequest) {
        throw new Error("Payout request not found");
      }
      
      // Calculate platform fee and final amount
      const platformFee = Number((payoutRequest.amount * (platformFeePercentage / 100)).toFixed(2));
      const finalAmount = Number((payoutRequest.amount - platformFee).toFixed(2));
      
      // Update payout request
      const { error: updateError } = await supabase
        .from('payout_requests')
        .update({
          status: action === 'approve' ? 'approved' : 'rejected',
          processed_at: new Date().toISOString(),
          processed_by: (await supabase.auth.getSession()).data.session?.user.id,
          platform_fee: platformFee,
          final_amount: finalAmount,
          notes: notes,
          ...(action === 'approve' ? { approved_at: new Date().toISOString() } : {})
        })
        .eq('id', id);
      
      if (updateError) throw updateError;
      
      // Log admin action
      await supabase.from('admin_audit_logs').insert({
        user_id: (await supabase.auth.getSession()).data.session?.user.id,
        action: `payout_${action}`,
        details: {
          payout_id: id,
          creator_id: payoutRequest.creator_id,
          amount: payoutRequest.amount,
          platform_fee: platformFee,
          final_amount: finalAmount,
          timestamp: new Date().toISOString(),
          notes: notes
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payout-requests"] });
      setActionDialogOpen(false);
      setActionNotes("");
      
      const actionMessages = {
        approve: "Payout approved successfully",
        reject: "Payout request rejected"
      };
      
      toast({
        title: "Action Complete",
        description: actionType ? actionMessages[actionType] : "Payout request updated",
      });
    },
    onError: (error) => {
      console.error("Error processing payout action:", error);
      toast({
        title: "Action Failed",
        description: "There was an error processing this payout request",
        variant: "destructive",
      });
    }
  });

  // Calculate total pages
  const totalPages = Math.ceil((data?.totalCount || 0) / pageSize);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-500 border-red-500/30">Rejected</Badge>;
      case 'paid':
        return <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">Paid</Badge>;
      case 'failed':
        return <Badge className="bg-purple-900/20 text-purple-400 border-purple-400/30">Failed</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-500 border-gray-500/30">Unknown</Badge>;
    }
  };

  // Calculate platform fee and final amount
  const calculateFee = (amount: number) => {
    const platformFee = Number((amount * (platformFeePercentage / 100)).toFixed(2));
    const finalAmount = Number((amount - platformFee).toFixed(2));
    return { platformFee, finalAmount };
  };

  if (isLoading) {
    return <LoadingState message="Loading payout requests..." />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
        <div className="relative w-full md:w-auto md:min-w-[250px] lg:flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by creator name..."
            className="pl-10 bg-[#0D1117]/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-[#0D1117]/50">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          
          <DateRangePicker
            from={dateRange.from}
            to={dateRange.to}
            onSelect={setDateRange}
          />
        </div>
      </div>

      <div className="rounded-md border border-white/10 overflow-hidden">
        <Table>
          <TableHeader className="bg-[#0D1117]">
            <TableRow>
              <TableHead>Creator</TableHead>
              <TableHead>Request Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Platform Fee (7%)</TableHead>
              <TableHead>Final Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.payouts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  No payout requests found
                </TableCell>
              </TableRow>
            ) : (
              data?.payouts.map((payout) => {
                const { platformFee, finalAmount } = calculateFee(payout.amount);
                
                return (
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
                          <div className="font-semibold">{payout.profiles?.username || 'Unknown Creator'}</div>
                          <div className="text-xs text-muted-foreground">
                            {payout.profiles?.first_name && payout.profiles?.last_name 
                              ? `${payout.profiles.first_name} ${payout.profiles.last_name}` 
                              : 'No name provided'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(payout.requested_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{payout.amount.toFixed(2)} SEK</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-amber-500">{platformFee.toFixed(2)} SEK</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-green-500">{finalAmount.toFixed(2)} SEK</div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(payout.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 w-8 p-0 bg-[#0D1117]/50"
                          onClick={() => {
                            setSelectedPayout({
                              ...payout,
                              calculatedPlatformFee: platformFee,
                              calculatedFinalAmount: finalAmount
                            });
                            setViewDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {payout.status === 'pending' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-8 w-8 p-0 text-green-500 border-green-500/30 bg-green-500/10"
                              onClick={() => {
                                setSelectedPayout({
                                  ...payout,
                                  calculatedPlatformFee: platformFee,
                                  calculatedFinalAmount: finalAmount
                                });
                                setActionType('approve');
                                setActionDialogOpen(true);
                              }}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 border-red-500/30 bg-red-500/10"
                              onClick={() => {
                                setSelectedPayout({
                                  ...payout,
                                  calculatedPlatformFee: platformFee,
                                  calculatedFinalAmount: finalAmount
                                });
                                setActionType('reject');
                                setActionDialogOpen(true);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {data?.payouts.length ? ((currentPage - 1) * pageSize) + 1 : 0}-
          {Math.min(currentPage * pageSize, data?.totalCount || 0)} of {data?.totalCount || 0} payout requests
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

      {/* View Payout Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Payout Request Details</DialogTitle>
            <DialogDescription>
              Requested on {selectedPayout?.requested_at && format(new Date(selectedPayout.requested_at), 'MMMM d, yyyy')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                {selectedPayout?.profiles?.avatar_url ? (
                  <img 
                    src={selectedPayout.profiles.avatar_url} 
                    alt={selectedPayout.profiles.username || 'Creator'} 
                    className="h-12 w-12 object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <div>
                <div className="font-semibold">{selectedPayout?.profiles?.username || 'Unknown Creator'}</div>
                <div className="text-sm text-muted-foreground">
                  {selectedPayout?.profiles?.first_name && selectedPayout?.profiles?.last_name 
                    ? `${selectedPayout.profiles.first_name} ${selectedPayout.profiles.last_name}` 
                    : 'No name provided'}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 p-4 bg-[#0D1117]/50 rounded-md border border-white/10">
              <div>
                <div className="text-sm text-muted-foreground">Requested Amount</div>
                <div className="text-lg font-semibold">{selectedPayout?.amount.toFixed(2)} SEK</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <div>{selectedPayout && getStatusBadge(selectedPayout.status)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Platform Fee (7%)</div>
                <div className="text-amber-500">{selectedPayout?.calculatedPlatformFee.toFixed(2)} SEK</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Final Amount</div>
                <div className="text-green-500 font-semibold">{selectedPayout?.calculatedFinalAmount.toFixed(2)} SEK</div>
              </div>
            </div>
            
            {selectedPayout?.processed_at && (
              <div>
                <div className="text-sm text-muted-foreground mb-1">Processed</div>
                <div className="text-sm">{format(new Date(selectedPayout.processed_at), 'MMMM d, yyyy')}</div>
              </div>
            )}
            
            {selectedPayout?.notes && (
              <div>
                <div className="text-sm text-muted-foreground mb-1">Notes</div>
                <div className="p-3 bg-[#161B22] border border-white/10 rounded-md text-sm">
                  {selectedPayout.notes}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            {selectedPayout?.status === 'pending' && (
              <div className="flex justify-between w-full">
                <Button 
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setViewDialogOpen(false);
                    setActionType('reject');
                    setActionDialogOpen(true);
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button 
                  variant="default"
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setViewDialogOpen(false);
                    setActionType('approve');
                    setActionDialogOpen(true);
                  }}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </div>
            )}
            {selectedPayout?.status !== 'pending' && (
              <Button 
                variant="outline"
                onClick={() => setViewDialogOpen(false)}
              >
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Payout Request' : 'Reject Payout Request'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve' 
                ? 'This will approve the payout request and mark it ready for payment.' 
                : 'This will reject the payout request.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                  {selectedPayout?.profiles?.avatar_url ? (
                    <img 
                      src={selectedPayout.profiles.avatar_url} 
                      alt={selectedPayout.profiles.username || 'Creator'} 
                      className="h-8 w-8 object-cover"
                    />
                  ) : (
                    <User className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                <span className="font-medium">{selectedPayout?.profiles?.username || 'Unknown Creator'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span className="font-semibold">{selectedPayout?.amount.toFixed(2)} SEK</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-4 p-2 bg-[#0D1117]/50 rounded-md border border-white/10">
              <div>
                <div className="text-xs text-muted-foreground">Platform Fee (7%)</div>
                <div className="text-amber-500">{selectedPayout?.calculatedPlatformFee.toFixed(2)} SEK</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Final Amount</div>
                <div className="text-green-500 font-semibold">{selectedPayout?.calculatedFinalAmount.toFixed(2)} SEK</div>
              </div>
            </div>
            
            <div className="mb-1">
              <div className="text-sm font-medium mb-1">Notes {actionType === 'reject' && '(Required)'}</div>
              <Textarea
                placeholder={`Enter notes for ${actionType === 'approve' ? 'approval' : 'rejection'}...`}
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                className="min-h-[100px] bg-[#0D1117]/50"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => {
                setActionDialogOpen(false);
                setActionNotes("");
              }}
            >
              Cancel
            </Button>
            <Button 
              variant={actionType === 'approve' ? 'default' : 'destructive'}
              onClick={() => {
                if (selectedPayout && actionType) {
                  handlePayoutAction.mutate({
                    id: selectedPayout.id,
                    action: actionType,
                    notes: actionNotes
                  });
                }
              }}
              disabled={actionType === 'reject' && !actionNotes}
              className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {actionType === 'approve' ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Approve Payout
                </>
              ) : (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Reject Payout
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

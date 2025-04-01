
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
  Check, 
  X, 
  AlertCircle, 
  Eye, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  DownloadCloud
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { LoadingState } from "@/components/ui/LoadingState";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const VerificationRequests = () => {
  const [selectedVerification, setSelectedVerification] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'fraud' | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 10;
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch verification requests
  const { data, isLoading } = useQuery({
    queryKey: ["verification-requests", currentPage, statusFilter, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('id_verifications')
        .select(`
          *,
          profiles!id_verifications_user_id_fkey(
            id,
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
      
      // Apply search filter
      if (searchTerm) {
        query = query.or(`profiles.username.ilike.%${searchTerm}%,profiles.first_name.ilike.%${searchTerm}%,profiles.last_name.ilike.%${searchTerm}%`);
      }
      
      // Apply pagination
      const from = (currentPage - 1) * pageSize;
      query = query.range(from, from + pageSize - 1).order('submitted_at', { ascending: false });
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      return { verifications: data, totalCount: count || 0 };
    }
  });

  // Handle verification actions (approve/reject/mark as fraud)
  const handleVerification = useMutation({
    mutationFn: async ({ 
      id, 
      action, 
      reason = null 
    }: { 
      id: string; 
      action: 'approve' | 'reject' | 'fraud'; 
      reason?: string | null 
    }) => {
      // Update verification status
      const { error: verificationError } = await supabase
        .from('id_verifications')
        .update({
          status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'fraud',
          rejected_reason: reason,
          verified_at: action === 'approve' ? new Date().toISOString() : null
        })
        .eq('id', id);
      
      if (verificationError) throw verificationError;
      
      // If approved, update the user's profile
      if (action === 'approve') {
        const verification = data?.verifications.find(v => v.id === id);
        
        if (verification) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              id_verification_status: 'verified',
              is_age_verified: true
            })
            .eq('id', verification.user_id);
          
          if (profileError) throw profileError;
        }
      }
      
      // Log admin action
      await supabase.from('admin_audit_logs').insert({
        user_id: (await supabase.auth.getSession()).data.session?.user.id,
        action: `verification_${action}`,
        details: {
          verification_id: id,
          timestamp: new Date().toISOString(),
          reason: reason || undefined
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["verification-requests"] });
      setActionDialogOpen(false);
      setRejectionReason("");
      
      const actionMessages = {
        approve: "Verification approved successfully",
        reject: "Verification rejected",
        fraud: "Account marked as fraudulent"
      };
      
      toast({
        title: "Action Complete",
        description: actionType ? actionMessages[actionType] : "Verification updated",
      });
    },
    onError: (error) => {
      console.error("Error processing verification:", error);
      toast({
        title: "Action Failed",
        description: "There was an error processing this verification",
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
      case 'fraud':
        return <Badge className="bg-purple-900/20 text-purple-400 border-purple-400/30">Fraud</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-500 border-gray-500/30">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading verification requests..." />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-auto sm:min-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by username..."
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
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="fraud">Marked as Fraud</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border border-white/10 overflow-hidden">
        <Table>
          <TableHeader className="bg-[#0D1117]">
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Document Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.verifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No verification requests found
                </TableCell>
              </TableRow>
            ) : (
              data?.verifications.map((verification) => (
                <TableRow key={verification.id} className="border-white/5 hover:bg-[#0D1117]/50">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                        {verification.profiles?.avatar_url ? (
                          <img 
                            src={verification.profiles.avatar_url} 
                            alt={verification.profiles.username || 'User'} 
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">{verification.profiles?.username || 'Unknown User'}</div>
                        <div className="text-xs text-muted-foreground">
                          {verification.profiles?.first_name && verification.profiles?.last_name 
                            ? `${verification.profiles.first_name} ${verification.profiles.last_name}` 
                            : 'No name provided'}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{verification.document_type}</TableCell>
                  <TableCell>{getStatusBadge(verification.status)}</TableCell>
                  <TableCell>
                    {format(new Date(verification.submitted_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    {verification.verified_at 
                      ? format(new Date(verification.verified_at), 'MMM d, yyyy')
                      : '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8 w-8 p-0 bg-[#0D1117]/50"
                        onClick={() => {
                          setSelectedVerification(verification);
                          setViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {verification.status === 'pending' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 w-8 p-0 text-green-500 border-green-500/30 bg-green-500/10"
                            onClick={() => {
                              setSelectedVerification(verification);
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
                              setSelectedVerification(verification);
                              setActionType('reject');
                              setActionDialogOpen(true);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 w-8 p-0 text-purple-400 border-purple-400/30 bg-purple-900/10"
                            onClick={() => {
                              setSelectedVerification(verification);
                              setActionType('fraud');
                              setActionDialogOpen(true);
                            }}
                          >
                            <AlertCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {data?.verifications.length ? ((currentPage - 1) * pageSize) + 1 : 0}-
          {Math.min(currentPage * pageSize, data?.totalCount || 0)} of {data?.totalCount || 0} requests
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

      {/* View Document Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Verification Document</DialogTitle>
            <DialogDescription>
              Submitted by {selectedVerification?.profiles?.username || 'Unknown User'} on {' '}
              {selectedVerification?.submitted_at && format(new Date(selectedVerification.submitted_at), 'MMMM d, yyyy')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Document Type</h3>
              <p className="text-sm">{selectedVerification?.document_type}</p>
            </div>
            
            {selectedVerification?.document_url && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Uploaded Document</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1 h-7 text-xs"
                    onClick={() => window.open(selectedVerification.document_url, '_blank')}
                  >
                    <DownloadCloud className="h-3 w-3" />
                    Download
                  </Button>
                </div>
                <div className="border border-white/10 rounded-md overflow-hidden">
                  <img 
                    src={selectedVerification.document_url} 
                    alt="Verification Document" 
                    className="w-full h-auto max-h-[400px] object-contain bg-black"
                  />
                </div>
              </div>
            )}
            
            {selectedVerification?.status === 'rejected' && selectedVerification?.rejected_reason && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Rejection Reason</h3>
                <Card className="p-3 bg-red-900/10 border-red-500/20">
                  <p className="text-sm">{selectedVerification.rejected_reason}</p>
                </Card>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => setViewDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Verification' : 
               actionType === 'reject' ? 'Reject Verification' : 
               'Mark as Fraudulent'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve' ? 'This will verify the user\'s identity.' : 
               actionType === 'reject' ? 'Please provide a reason for rejection.' : 
               'This will flag the account as fraudulent and may lead to account suspension.'}
            </DialogDescription>
          </DialogHeader>
          
          {(actionType === 'reject' || actionType === 'fraud') && (
            <div className="py-2">
              <Textarea
                placeholder={`Enter reason for ${actionType === 'reject' ? 'rejection' : 'fraud report'}...`}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-[100px] bg-[#0D1117]/50"
              />
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => {
                setActionDialogOpen(false);
                setRejectionReason("");
              }}
            >
              Cancel
            </Button>
            <Button 
              variant={actionType === 'approve' ? 'default' : 'destructive'}
              onClick={() => {
                if (selectedVerification && actionType) {
                  handleVerification.mutate({
                    id: selectedVerification.id,
                    action: actionType,
                    reason: (actionType === 'reject' || actionType === 'fraud') ? rejectionReason : null
                  });
                }
              }}
              disabled={
                (actionType === 'reject' || actionType === 'fraud') && !rejectionReason
              }
            >
              {actionType === 'approve' ? 'Approve' : 
               actionType === 'reject' ? 'Reject' : 
               'Mark as Fraud'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper component for consistency
const User = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

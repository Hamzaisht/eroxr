
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { 
  CheckCircle,
  XCircle,
  User,
  Calendar,
  FileText,
  Eye,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { IdVerification } from "@/integrations/supabase/types/verification";
import { LoadingState } from "@/components/ui/LoadingState";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
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
import { Input } from "@/components/ui/input";

export const VerificationRequests = () => {
  const [filter, setFilter] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewDocument, setViewDocument] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<IdVerification | null>(null);
  const { toast } = useToast();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["verification-requests", filter, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from("id_verifications")
        .select(`
          *,
          profiles:user_id (
            username,
            first_name,
            last_name,
            avatar_url,
            id_verification_status
          )
        `);

      // Apply status filter
      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      // Apply search if present
      if (searchTerm) {
        query = query.or(`profiles.username.ilike.%${searchTerm}%,profiles.first_name.ilike.%${searchTerm}%,profiles.last_name.ilike.%${searchTerm}%`);
      }

      query = query.order("submitted_at", { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching verification requests:", error);
        throw error;
      }

      return data;
    },
  });

  const handleApproveRequest = async (request: IdVerification) => {
    try {
      // Update verification status in id_verifications table
      const { error: verificationError } = await supabase
        .from("id_verifications")
        .update({
          status: "approved",
          verified_at: new Date().toISOString(),
        })
        .eq("id", request.id);

      if (verificationError) throw verificationError;

      // Update user profile verification status
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          id_verification_status: "verified",
        })
        .eq("id", request.user_id);

      if (profileError) throw profileError;

      // Log admin action
      await supabase.from("admin_audit_logs").insert({
        user_id: (await supabase.auth.getSession()).data.session?.user.id,
        action: "verification_approved",
        details: {
          verification_id: request.id,
          user_id: request.user_id,
          timestamp: new Date().toISOString(),
        },
      });

      toast({
        title: "Verification Approved",
        description: "The user has been successfully verified.",
      });

      refetch();
    } catch (error) {
      console.error("Error approving verification:", error);
      toast({
        title: "Approval Failed",
        description: "There was an error approving this verification.",
        variant: "destructive",
      });
    }
  };

  const openRejectionDialog = (request: IdVerification) => {
    setSelectedRequest(request);
    setRejectionReason("");
    setRejectionDialogOpen(true);
  };

  const handleRejectRequest = async () => {
    if (!selectedRequest) return;
    
    try {
      // Update verification status in id_verifications table
      const { error: verificationError } = await supabase
        .from("id_verifications")
        .update({
          status: "rejected",
          rejected_reason: rejectionReason,
        })
        .eq("id", selectedRequest.id);

      if (verificationError) throw verificationError;

      // Update user profile verification status
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          id_verification_status: "rejected",
        })
        .eq("id", selectedRequest.user_id);

      if (profileError) throw profileError;

      // Log admin action
      await supabase.from("admin_audit_logs").insert({
        user_id: (await supabase.auth.getSession()).data.session?.user.id,
        action: "verification_rejected",
        details: {
          verification_id: selectedRequest.id,
          user_id: selectedRequest.user_id,
          reason: rejectionReason,
          timestamp: new Date().toISOString(),
        },
      });

      toast({
        title: "Verification Rejected",
        description: "The verification request has been rejected.",
      });

      setRejectionDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Error rejecting verification:", error);
      toast({
        title: "Rejection Failed",
        description: "There was an error rejecting this verification.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading verification requests..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="relative w-full sm:w-64">
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#0D1117]/50"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-[#0D1117]/50">
              <Filter className="mr-2 h-4 w-4" />
              {filter === "all"
                ? "All Statuses"
                : filter === "pending"
                ? "Pending"
                : filter === "approved"
                ? "Approved"
                : "Rejected"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilter("all")}>
              All Statuses
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("pending")}>
              Pending
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("approved")}>
              Approved
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("rejected")}>
              Rejected
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {data && data.length === 0 ? (
        <div className="text-center p-8 bg-[#0D1117]/50 border border-white/10 rounded-lg">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No verification requests found</h3>
          <p className="mt-2 text-muted-foreground">
            {filter === "pending"
              ? "There are no pending verification requests."
              : filter === "approved"
              ? "No approved verifications found."
              : filter === "rejected"
              ? "No rejected verification requests."
              : "No verification requests match your search."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.map((request: any) => (
            <Card key={request.id} className="bg-[#0D1117]/50 border-white/10">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                      {request.profiles?.avatar_url ? (
                        <img
                          src={request.profiles.avatar_url}
                          alt={request.profiles.username || "User"}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-md">
                        {request.profiles?.username || "Unnamed User"}
                      </CardTitle>
                      <CardDescription>
                        {request.profiles?.first_name && request.profiles?.last_name
                          ? `${request.profiles.first_name} ${request.profiles.last_name}`
                          : "No name provided"}
                      </CardDescription>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    request.status === "pending"
                      ? "bg-yellow-500/20 text-yellow-500"
                      : request.status === "approved"
                      ? "bg-green-500/20 text-green-500"
                      : "bg-red-500/20 text-red-500"
                  }`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Submitted: {format(new Date(request.submitted_at), "MMM d, yyyy")}</span>
                </div>
                <div className="flex items-center text-sm">
                  <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Document: {request.document_type}</span>
                </div>
                {request.rejected_reason && (
                  <div className="mt-3 p-2 bg-red-900/20 border border-red-900/40 rounded text-sm">
                    <span className="font-semibold">Rejection reason:</span> {request.rejected_reason}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewDocument(request.document_url)}
                  className="bg-[#161B22] hover:bg-[#1D2433]"
                >
                  <Eye className="mr-1 h-4 w-4" />
                  View Document
                </Button>
                {request.status === "pending" && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openRejectionDialog(request)}
                      className="bg-red-900/20 hover:bg-red-900/40 border-red-900/40 text-red-500"
                    >
                      <XCircle className="mr-1 h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApproveRequest(request)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Approve
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Document Viewer Dialog */}
      <Dialog open={!!viewDocument} onOpenChange={() => setViewDocument(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Verification Document</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-black/50 rounded-md overflow-hidden">
            {viewDocument && viewDocument.toLowerCase().endsWith('.pdf') ? (
              <iframe 
                src={viewDocument} 
                className="w-full h-[500px]"
                title="Verification Document"
              />
            ) : (
              <img 
                src={viewDocument || ''} 
                alt="Verification Document" 
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Rejection Reason Dialog */}
      <AlertDialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Verification Request</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this verification request:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <Input
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Rejection reason"
              className="w-full"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRejectRequest}
              disabled={!rejectionReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

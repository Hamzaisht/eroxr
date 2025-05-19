
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { formatDistanceToNow } from 'date-fns';
import { 
  Check,
  X,
  Search, 
  FileJson,
  RefreshCw,
  AlertTriangle,
  Trash2
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
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
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { LoadingState } from "@/components/ui/LoadingState";
import { 
  safeReportUpdate, 
  safeReportFilter, 
  safeAdminLogInsert,
  exists
} from '@/utils/supabase/type-guards';

interface ReportItem {
  id: string;
  created_at: string;
  reason: string;
  content_id: string;
  content_type: string;
  is_emergency: boolean;
  status: string;
  profiles?: {
    username?: string;
    avatar_url?: string;
    id?: string;
  } | null;
}

export const ErosMode = () => {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionReason, setActionReason] = useState("");
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | "delete" | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: ["reports", searchQuery, statusFilter, currentPage],
    queryFn: async () => {
      let query = supabase
        .from('reports')
        .select(`
          id,
          created_at,
          reason,
          content_id,
          content_type,
          is_emergency,
          status,
          profiles:reporter_id(
            id,
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.ilike('reason', `%${searchQuery}%`);
      }

      if (statusFilter !== "all") {
        // Use safer approach without specific type casting
        query = query.eq('status', statusFilter);
      }

      const { data: reports, error, count } = await query
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

      if (error) throw error;

      // Type-safely process each report
      const safeReports: ReportItem[] = Array.isArray(reports) ? 
        reports.filter(exists).map(report => ({
          id: report.id,
          created_at: report.created_at || "",
          reason: report.reason || "",
          content_id: report.content_id || "",
          content_type: report.content_type || "",
          is_emergency: !!report.is_emergency,
          status: report.status || "",
          profiles: report.profiles || null
        })) : [];

      return {
        items: safeReports,
        totalCount: count || 0,
      };
    },
  });

  const handleActionClick = (report: ReportItem, action: "approve" | "reject" | "delete") => {
    setSelectedReport(report);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const confirmAction = () => {
    setActionDialogOpen(false);
    setConfirmDialogOpen(true);
  };

  const executeAction = async () => {
    if (!session?.user?.id || !selectedReport || !actionType) return;

    try {
      if (actionType === "delete") {
        // Delete the content
        const { error: deleteError } = await supabase
          .from(selectedReport.content_type)
          .delete()
          .eq('id', selectedReport.content_id);

        if (deleteError) throw deleteError;
      }

      // Update the report
      const updates = safeReportUpdate({ 
        status: 'resolved', 
        resolved_by: session.user.id 
      });
      
      const [reportColumn, reportValue] = safeReportFilter('id', selectedReport.id);
      
      const { error } = await supabase
        .from('reports')
        .update(updates)
        .eq(reportColumn, reportValue);

      if (error) throw error;

      // Log the admin action
      const logData = safeAdminLogInsert({
        admin_id: session.user.id,
        action: actionType,
        action_type: actionType,
        target_id: selectedReport.id,
        target_type: 'report',
        details: { action: actionType }
      });
      
      const { error: logError } = await supabase
        .from('admin_logs')
        .insert([logData]);

      if (logError) throw logError;

      toast({
        title: "Action successful",
        description: `Report ${actionType}ed successfully`,
      });

      setActionDialogOpen(false);
      setConfirmDialogOpen(false);
      setSelectedReport(null);
      setActionType(null);
      setActionReason("");
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    } catch (err: any) {
      console.error("Action error:", err);
      toast({
        title: "Action failed",
        description: err.message || "Failed to perform action",
        variant: "destructive",
      });
    }
  };

  const exportAsJson = () => {
    if (!data) return;

    const jsonString = JSON.stringify(data.items, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = 'reports.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Open</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Resolved</Badge>;
      case 'pending':
        return <Badge className="bg-gray-500/20 text-gray-500 border-gray-500/30">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading reports..." />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Failed to load reports</h3>
        <p className="text-gray-500 mb-4">
          {error instanceof Error ? error.message : "An unknown error occurred"}
        </p>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" /> Retry
        </Button>
      </div>
    );
  }

  const safeItems = (data?.items || []) as ReportItem[];

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by reason..."
            className="pl-10 bg-gray-950"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-gray-950">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportAsJson} variant="outline" className="gap-2">
            <FileJson className="h-4 w-4" />
            JSON
          </Button>
        </div>
      </div>

      <div className="rounded-md border border-gray-800 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-950">
            <TableRow>
              <TableHead>Reason</TableHead>
              <TableHead>Content Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reporter</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {safeItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-gray-400">
                  No reports found
                </TableCell>
              </TableRow>
            ) : (
              safeItems.map((report) => {
                // Safe access with defaults
                const profileUsername = report.profiles?.username || 'Unknown User';
                const profileAvatar = report.profiles?.avatar_url;
                const reportReason = report.reason || 'No reason provided';
                const contentType = report.content_type || 'Unknown';
                const status = report.status || 'pending';
                const createdAt = report.created_at ? new Date(report.created_at) : new Date();
                
                return (
                  <TableRow key={report.id}>
                    <TableCell className="max-w-[200px] truncate" title={reportReason}>
                      {reportReason}
                    </TableCell>
                    <TableCell className="capitalize">{contentType}</TableCell>
                    <TableCell>{getStatusBadge(status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                          {profileAvatar ? (
                            <img 
                              src={profileAvatar} 
                              alt={profileUsername} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-xs text-gray-300">
                              {profileUsername.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <span>{profileUsername}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDistanceToNow(createdAt, { addSuffix: true })}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 w-8 p-0 text-green-500"
                                onClick={() => handleActionClick(report, "approve")}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Approve Report</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500"
                                onClick={() => handleActionClick(report, "reject")}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Reject Report</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 w-8 p-0 text-red-600"
                                onClick={() => handleActionClick(report, "delete")}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete Content</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400">
          Showing {Math.min(itemsPerPage, safeItems.length || 0)} of {data?.totalCount} reports
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={(safeItems.length || 0) < itemsPerPage}
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Approve Report" : actionType === "reject" ? "Reject Report" : "Delete Content"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "This will approve the report and take action on the content."
                : actionType === "reject"
                  ? "This will reject the report and no action will be taken."
                  : "This will delete the content from the platform."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Reason for action</h4>
              <Textarea
                placeholder={`Explain why you're ${actionType === "approve" ? "approving" : actionType === "reject" ? "rejecting" : "deleting"} this report...`}
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            {selectedReport && (
              <div className="space-y-2 p-3 rounded-md bg-gray-950">
                <h4 className="text-sm font-medium">Report Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-400">Reported By:</span>
                  <span>{selectedReport.profiles?.username || 'Unknown'}</span>
                  <span className="text-gray-400">Content Type:</span>
                  <span>{selectedReport.content_type}</span>
                  <span className="text-gray-400">Reason:</span>
                  <span>{selectedReport.reason}</span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAction} disabled={!actionReason}>
              Confirm {actionType}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Moderation Action</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {actionType} this report?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={executeAction}>
              {actionType === "approve" ? <Check className="mr-2 h-4 w-4" /> : actionType === "reject" ? <X className="mr-2 h-4 w-4" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Confirm {actionType}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

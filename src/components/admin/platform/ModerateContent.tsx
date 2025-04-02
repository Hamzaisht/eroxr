
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { format } from "date-fns";
import { 
  Ban, 
  EyeOff, 
  FileJson, 
  FileCog, 
  Search, 
  Download, 
  Filter,
  RotateCcw,
  AlertTriangle,
  Trash2,
  X,
  Check,
  Info
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

interface FlaggedContent {
  id: string;
  content_id: string;
  content_type: string;
  user_id: string;
  username?: string;
  avatar_url?: string;
  reason: string;
  flagged_at: string;
  status: 'active' | 'flagged' | 'deleted' | 'shadowbanned' | 'restored';
  severity: 'low' | 'medium' | 'high' | 'critical';
  details?: any;
}

export const ModerateContent = () => {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [contentTypeFilter, setContentTypeFilter] = useState("all");
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionReason, setActionReason] = useState("");
  const [selectedContent, setSelectedContent] = useState<FlaggedContent | null>(null);
  const [actionType, setActionType] = useState<"delete" | "shadowban" | "ban" | "restore" | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Fetch flagged content
  const { data, isLoading, error } = useQuery({
    queryKey: ["flagged_content", searchQuery, statusFilter, contentTypeFilter, currentPage],
    queryFn: async () => {
      const { data: reportsData, error: reportsError } = await supabase
        .from('reports')
        .select(`
          id,
          content_id,
          content_type,
          reported_id,
          reason,
          created_at,
          status,
          is_emergency,
          profiles!reports_reported_id_fkey(username, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (reportsError) throw reportsError;

      // Transform data to match our FlaggedContent interface
      const formattedData: FlaggedContent[] = reportsData.map(report => ({
        id: report.id,
        content_id: report.content_id || '',
        content_type: report.content_type,
        user_id: report.reported_id || '',
        username: report.profiles?.username || 'Unknown',
        avatar_url: report.profiles?.avatar_url || '',
        reason: report.reason,
        flagged_at: report.created_at,
        status: report.status === 'resolved' ? 'deleted' : 'flagged',
        severity: report.is_emergency ? 'critical' : 'medium'
      }));

      // Apply filters
      let filteredData = [...formattedData];
      
      if (searchQuery) {
        filteredData = filteredData.filter(item => 
          item.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.reason.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (statusFilter !== "all") {
        filteredData = filteredData.filter(item => item.status === statusFilter);
      }
      
      if (contentTypeFilter !== "all") {
        filteredData = filteredData.filter(item => item.content_type === contentTypeFilter);
      }
      
      // Apply pagination
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const pagedData = filteredData.slice(start, end);
      
      return {
        items: pagedData,
        totalCount: filteredData.length
      };
    }
  });

  // Perform moderation action
  const moderationAction = useMutation({
    mutationFn: async ({ 
      contentId, 
      userId, 
      action, 
      reason 
    }: { 
      contentId: string; 
      userId: string; 
      action: "delete" | "shadowban" | "ban" | "restore"; 
      reason: string 
    }) => {
      if (!session?.user?.id) throw new Error("Not authenticated");
      
      let contentTableName = "";
      let contentStatus = "";
      let targetType = "";
      let actionType = "";
      let severityLevel = "medium";
      
      // Determine which table to update based on content type
      if (selectedContent) {
        switch (selectedContent.content_type) {
          case "post":
            contentTableName = "posts";
            targetType = "post";
            break;
          case "video":
            contentTableName = "videos";
            targetType = "video";
            break;
          case "message":
            contentTableName = "direct_messages";
            targetType = "message";
            break;
          case "comment":
            contentTableName = "comments";
            targetType = "comment";
            break;
          case "dating_ad":
            contentTableName = "dating_ads";
            targetType = "dating_ad";
            break;
          default:
            contentTableName = "posts"; // Default fallback
            targetType = "content";
        }
      }
      
      // Set appropriate status based on action
      switch (action) {
        case "delete":
          contentStatus = "deleted";
          actionType = "delete_content";
          break;
        case "shadowban":
          contentStatus = "shadowbanned";
          actionType = "shadowban_content";
          break;
        case "restore":
          contentStatus = "active";
          actionType = "restore_content";
          break;
        case "ban":
          actionType = "ban_user";
          severityLevel = "high";
          break;
      }
      
      // Perform the appropriate action
      if (action === "ban") {
        // Ban user
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            is_suspended: true,
            suspended_at: new Date().toISOString()
          })
          .eq('id', userId);
          
        if (profileError) throw profileError;
      } else if (contentTableName && contentId) {
        // Update content status
        if (contentTableName === "posts" || contentTableName === "videos") {
          const { error: contentError } = await supabase
            .from(contentTableName)
            .update({ visibility: contentStatus })
            .eq('id', contentId);
            
          if (contentError) throw contentError;
        } else if (contentTableName === "dating_ads") {
          const { error: adError } = await supabase
            .from(contentTableName)
            .update({ 
              is_active: action === "restore",
              moderation_status: contentStatus
            })
            .eq('id', contentId);
            
          if (adError) throw adError;
        } else if (contentTableName === "direct_messages" || contentTableName === "comments") {
          const { error: messageError } = await supabase
            .from(contentTableName)
            .update({ 
              content: action === "delete" ? "[Content removed by moderator]" : contentStatus
            })
            .eq('id', contentId);
            
          if (messageError) throw messageError;
        }
      }
      
      // Update report status
      if (selectedContent) {
        const { error: reportError } = await supabase
          .from('reports')
          .update({
            status: 'resolved',
            action_taken: action,
            resolution_notes: reason,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedContent.id);
          
        if (reportError) throw reportError;
      }
      
      // Log admin action
      const { error: logError } = await supabase
        .from('admin_audit_logs')
        .insert({
          user_id: session.user.id,
          action: actionType,
          details: {
            timestamp: new Date().toISOString(),
            admin_username: session.user.email,
            target_type: action === "ban" ? "user" : targetType,
            target_id: action === "ban" ? userId : contentId,
            reason: reason,
            severity: severityLevel,
            notes: reason
          }
        });
        
      if (logError) throw logError;
      
      return { success: true };
    },
    onSuccess: () => {
      setActionDialogOpen(false);
      setConfirmDialogOpen(false);
      setActionReason("");
      setSelectedContent(null);
      setActionType(null);
      
      queryClient.invalidateQueries({ queryKey: ["flagged_content"] });
      
      const actionMessages = {
        delete: "Content has been deleted",
        shadowban: "Content has been shadowbanned",
        ban: "User has been banned",
        restore: "Content has been restored"
      };
      
      toast({
        title: "Moderation action successful",
        description: actionType ? actionMessages[actionType] : "Action completed",
      });
    },
    onError: (error) => {
      console.error("Moderation action failed:", error);
      toast({
        title: "Action failed",
        description: error.message || "There was an error processing your request",
        variant: "destructive"
      });
    }
  });

  // Export data as JSON
  const exportAsJson = () => {
    if (!data) return;
    
    const jsonString = JSON.stringify(data.items, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `flagged_content_${format(new Date(), "yyyy-MM-dd")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export data as CSV
  const exportAsCsv = () => {
    if (!data) return;
    
    const headers = ["id", "content_type", "user", "reason", "status", "severity", "flagged_at"];
    
    const csvRows = [
      headers.join(","),
      ...data.items.map(item => {
        return [
          item.id,
          item.content_type,
          item.username,
          `"${item.reason.replace(/"/g, '""')}"`,
          item.status,
          item.severity,
          format(new Date(item.flagged_at), "yyyy-MM-dd HH:mm:ss")
        ].join(",");
      })
    ];
    
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `flagged_content_${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Active</Badge>;
      case 'flagged':
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Flagged</Badge>;
      case 'deleted':
        return <Badge className="bg-red-500/20 text-red-500 border-red-500/30">Deleted</Badge>;
      case 'shadowbanned':
        return <Badge className="bg-purple-500/20 text-purple-500 border-purple-500/30">Shadowbanned</Badge>;
      case 'restored':
        return <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">Restored</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return (
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
            <Badge className="bg-red-500/20 text-red-500 border-red-500/30">Critical</Badge>
          </div>
        );
      case 'high':
        return <Badge className="bg-orange-500/20 text-orange-500 border-orange-500/30">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Medium</Badge>;
      case 'low':
        return <Badge className="bg-gray-500/20 text-gray-500 border-gray-500/30">Low</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  // Get row style based on severity
  const getRowStyle = (severity: string) => {
    switch (severity) {
      case 'critical':
        return "bg-red-950/20 hover:bg-red-950/30 border-l-2 border-red-500";
      case 'high':
        return "bg-orange-950/10 hover:bg-orange-950/20";
      case 'medium':
        return "bg-yellow-950/5 hover:bg-yellow-950/10";
      default:
        return "";
    }
  };

  // Handler for action button clicks
  const handleActionClick = (content: FlaggedContent, action: "delete" | "shadowban" | "ban" | "restore") => {
    setSelectedContent(content);
    setActionType(action);
    setActionDialogOpen(true);
  };

  // Confirm the moderation action
  const confirmAction = () => {
    setActionDialogOpen(false);
    setConfirmDialogOpen(true);
  };

  // Execute the moderation action
  const executeAction = () => {
    if (!selectedContent || !actionType) return;
    
    moderationAction.mutate({
      contentId: selectedContent.content_id,
      userId: selectedContent.user_id,
      action: actionType,
      reason: actionReason
    });
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="w-1/3 h-10 bg-gray-800/50 animate-pulse rounded-md"></div>
          <div className="flex space-x-2">
            <div className="w-24 h-10 bg-gray-800/50 animate-pulse rounded-md"></div>
            <div className="w-24 h-10 bg-gray-800/50 animate-pulse rounded-md"></div>
          </div>
        </div>
        
        <div className="border rounded-md border-gray-800">
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="w-full h-16 bg-gray-800/50 animate-pulse rounded-md"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-xl font-bold text-red-500">Error Loading Content</h3>
        <p className="text-gray-400 mt-2">{(error as Error).message}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and filters */}
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by username or content ID..."
            className="pl-10 bg-gray-950"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
            <SelectTrigger className="w-[180px] bg-gray-950">
              <SelectValue placeholder="Content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="post">Posts</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="comment">Comments</SelectItem>
              <SelectItem value="message">Messages</SelectItem>
              <SelectItem value="dating_ad">Dating Ads</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-gray-950">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
              <SelectItem value="deleted">Deleted</SelectItem>
              <SelectItem value="shadowbanned">Shadowbanned</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={exportAsJson} variant="outline" className="gap-2">
            <FileJson className="h-4 w-4" />
            JSON
          </Button>
          
          <Button onClick={exportAsCsv} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            CSV
          </Button>
        </div>
      </div>

      {/* Content table */}
      <div className="rounded-md border border-gray-800 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-950">
            <TableRow>
              <TableHead>Content Type</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-gray-400">
                  No flagged content found
                </TableCell>
              </TableRow>
            ) : (
              data?.items.map((content) => (
                <TableRow key={content.id} className={getRowStyle(content.severity)}>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {content.content_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                        {content.avatar_url ? (
                          <img 
                            src={content.avatar_url} 
                            alt={content.username} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-gray-300">
                            {content.username?.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span>{content.username}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(content.status)}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={content.reason}>
                    {content.reason}
                  </TableCell>
                  <TableCell>{format(new Date(content.flagged_at), "dd MMM, HH:mm")}</TableCell>
                  <TableCell>{getSeverityBadge(content.severity)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500"
                              onClick={() => handleActionClick(content, "delete")}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete Content</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0 text-purple-500"
                              onClick={() => handleActionClick(content, "shadowban")}
                            >
                              <EyeOff className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Shadowban Content</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0 text-orange-500"
                              onClick={() => handleActionClick(content, "ban")}
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ban User</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0 text-green-500"
                              onClick={() => handleActionClick(content, "restore")}
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Restore Content</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data && data.totalCount > 0 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Showing {Math.min(itemsPerPage, data.items.length)} of {data.totalCount} items
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
              disabled={data.items.length < itemsPerPage}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Action reason dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "delete" ? "Delete Content" : 
               actionType === "shadowban" ? "Shadowban Content" : 
               actionType === "ban" ? "Ban User" : 
               "Restore Content"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "delete" ? "This content will be removed from the platform." : 
               actionType === "shadowban" ? "Content will be hidden from other users." : 
               actionType === "ban" ? "This user will be banned from the platform." : 
               "This content will be restored and visible again."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Reason for action</h4>
              <Textarea
                placeholder={`Explain why you're ${actionType === "delete" ? "deleting this content" : 
                                                actionType === "shadowban" ? "shadowbanning this content" : 
                                                actionType === "ban" ? "banning this user" : 
                                                "restoring this content"}...`}
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            {selectedContent && (
              <div className="space-y-2 p-3 rounded-md bg-gray-950">
                <h4 className="text-sm font-medium">Content Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-400">Type:</span>
                  <span>{selectedContent.content_type}</span>
                  
                  <span className="text-gray-400">User:</span>
                  <span>{selectedContent.username}</span>
                  
                  <span className="text-gray-400">Flag Reason:</span>
                  <span>{selectedContent.reason}</span>
                </div>
              </div>
            )}
            
            {actionType === "ban" && (
              <div className="flex p-3 rounded-md bg-red-950/20 text-red-400 items-start">
                <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  Banning a user is a severe action that will prevent them from accessing the platform. 
                  All their content will also be hidden from public view.
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant={actionType === "restore" ? "default" : "destructive"}
              onClick={confirmAction}
              disabled={!actionReason}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Moderation Action</AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "delete" ? "Are you sure you want to delete this content?" : 
               actionType === "shadowban" ? "Are you sure you want to shadowban this content?" : 
               actionType === "ban" ? "Are you sure you want to ban this user?" : 
               "Are you sure you want to restore this content?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeAction}
              className={actionType === "restore" ? "" : "bg-red-600 hover:bg-red-700"}
            >
              {actionType === "delete" ? <Trash2 className="mr-2 h-4 w-4" /> : 
               actionType === "shadowban" ? <EyeOff className="mr-2 h-4 w-4" /> : 
               actionType === "ban" ? <Ban className="mr-2 h-4 w-4" /> : 
               <Check className="mr-2 h-4 w-4" />}
              Confirm {actionType}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

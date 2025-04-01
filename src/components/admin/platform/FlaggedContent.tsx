
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
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  MoreHorizontal, 
  Trash, 
  Shield, 
  Eye, 
  AlertTriangle,
  Ban,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { LoadingState } from "@/components/ui/LoadingState";
import { 
  Dialog, 
  DialogContent, 
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

export const FlaggedContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [contentTypeFilter, setContentTypeFilter] = useState("all");
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [viewContentDialog, setViewContentDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [banDialog, setBanDialog] = useState(false);
  const { toast } = useToast();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["flagged-content", searchTerm, contentTypeFilter],
    queryFn: async () => {
      let query = supabase
        .from("reports")
        .select(`
          *,
          reporter:reporter_id (username, avatar_url),
          reported:reported_id (username, avatar_url)
        `)
        .eq("status", "pending")
        .order("is_emergency", { ascending: false })
        .order("created_at", { ascending: false });

      // Apply content type filter
      if (contentTypeFilter !== "all") {
        query = query.eq("content_type", contentTypeFilter);
      }

      // Apply search if present
      if (searchTerm) {
        query = query.or(`reason.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,reporter.username.ilike.%${searchTerm}%,reported.username.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching flagged content:", error);
        throw error;
      }

      // Fetch additional content details based on content_type
      const contentDetailsPromises = data.map(async (report) => {
        if (report.content_id) {
          let contentDetails = null;
          
          switch (report.content_type) {
            case "post":
              const { data: postData } = await supabase
                .from("posts")
                .select("*")
                .eq("id", report.content_id)
                .single();
              contentDetails = postData;
              break;
            case "dating_ad":
              const { data: adData } = await supabase
                .from("dating_ads")
                .select("*")
                .eq("id", report.content_id)
                .single();
              contentDetails = adData;
              break;
            case "message":
              const { data: messageData } = await supabase
                .from("direct_messages")
                .select("*")
                .eq("id", report.content_id)
                .single();
              contentDetails = messageData;
              break;
            // Add other content types as needed
          }
          
          return { ...report, contentDetails };
        }
        return report;
      });

      return Promise.all(contentDetailsPromises);
    },
  });

  const handleViewContent = (content: any) => {
    setSelectedContent(content);
    setViewContentDialog(true);
  };

  const handleMarkSafe = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from("reports")
        .update({
          status: "resolved",
          action_taken: "marked_safe",
          resolved_by: (await supabase.auth.getSession()).data.session?.user.id,
        })
        .eq("id", reportId);

      if (error) throw error;

      // Log admin action
      await supabase.from("admin_audit_logs").insert({
        user_id: (await supabase.auth.getSession()).data.session?.user.id,
        action: "report_marked_safe",
        details: {
          report_id: reportId,
          timestamp: new Date().toISOString(),
        },
      });

      toast({
        title: "Content Marked Safe",
        description: "The report has been resolved as safe.",
      });

      refetch();
    } catch (error) {
      console.error("Error marking content as safe:", error);
      toast({
        title: "Action Failed",
        description: "There was an error processing your request.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteContent = async () => {
    if (!selectedContent) return;
    
    try {
      // Delete content based on content_type
      if (selectedContent.content_type === "post") {
        await supabase
          .from("posts")
          .delete()
          .eq("id", selectedContent.content_id);
      } else if (selectedContent.content_type === "dating_ad") {
        await supabase
          .from("dating_ads")
          .delete()
          .eq("id", selectedContent.content_id);
      } else if (selectedContent.content_type === "message") {
        await supabase
          .from("direct_messages")
          .delete()
          .eq("id", selectedContent.content_id);
      }
      
      // Update report status
      const { error } = await supabase
        .from("reports")
        .update({
          status: "resolved",
          action_taken: "content_deleted",
          resolved_by: (await supabase.auth.getSession()).data.session?.user.id,
        })
        .eq("id", selectedContent.id);

      if (error) throw error;

      // Log admin action
      await supabase.from("admin_audit_logs").insert({
        user_id: (await supabase.auth.getSession()).data.session?.user.id,
        action: "content_deleted",
        details: {
          report_id: selectedContent.id,
          content_id: selectedContent.content_id,
          content_type: selectedContent.content_type,
          timestamp: new Date().toISOString(),
        },
      });

      toast({
        title: "Content Deleted",
        description: "The reported content has been deleted.",
      });

      setDeleteDialog(false);
      refetch();
    } catch (error) {
      console.error("Error deleting content:", error);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting the content.",
        variant: "destructive",
      });
    }
  };

  const handleBanUser = async () => {
    if (!selectedContent || !selectedContent.reported_id) return;
    
    try {
      // Ban user
      const { error } = await supabase
        .from("profiles")
        .update({
          is_suspended: true,
          suspended_at: new Date().toISOString(),
        })
        .eq("id", selectedContent.reported_id);

      if (error) throw error;
      
      // Update report status
      await supabase
        .from("reports")
        .update({
          status: "resolved",
          action_taken: "user_banned",
          resolved_by: (await supabase.auth.getSession()).data.session?.user.id,
        })
        .eq("id", selectedContent.id);

      // Log admin action
      await supabase.from("admin_audit_logs").insert({
        user_id: (await supabase.auth.getSession()).data.session?.user.id,
        action: "user_banned_from_report",
        details: {
          report_id: selectedContent.id,
          user_id: selectedContent.reported_id,
          content_id: selectedContent.content_id,
          content_type: selectedContent.content_type,
          timestamp: new Date().toISOString(),
        },
      });

      toast({
        title: "User Banned",
        description: "The user has been banned from the platform.",
      });

      setBanDialog(false);
      refetch();
    } catch (error) {
      console.error("Error banning user:", error);
      toast({
        title: "Ban Failed",
        description: "There was an error banning the user.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading flagged content..." />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-auto sm:min-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search reports..."
            className="pl-10 bg-[#0D1117]/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-[#0D1117]/50">
                Type: {contentTypeFilter === "all" ? "All" : contentTypeFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setContentTypeFilter("all")}>All Types</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setContentTypeFilter("post")}>Posts</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setContentTypeFilter("dating_ad")}>Dating Ads</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setContentTypeFilter("message")}>Messages</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border border-white/10 overflow-hidden">
        <Table>
          <TableHeader className="bg-[#0D1117]">
            <TableRow>
              <TableHead className="w-[180px]">Reported By</TableHead>
              <TableHead className="w-[180px]">Reported User</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead className="w-[100px]">Severity</TableHead>
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((report: any) => (
              <TableRow key={report.id} className="border-white/5 hover:bg-[#0D1117]/50">
                <TableCell>
                  <div className="flex items-center gap-2">
                    {report.reporter?.avatar_url ? (
                      <img
                        src={report.reporter.avatar_url}
                        alt={report.reporter.username || "Reporter"}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <span className="h-6 w-6 rounded-full bg-gray-700" />
                    )}
                    <span className="text-sm truncate max-w-[100px]">
                      {report.reporter?.username || "Anonymous"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {report.reported?.avatar_url ? (
                      <img
                        src={report.reported.avatar_url}
                        alt={report.reported.username || "Reported User"}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <span className="h-6 w-6 rounded-full bg-gray-700" />
                    )}
                    <span className="text-sm truncate max-w-[100px]">
                      {report.reported?.username || "Unknown User"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm truncate max-w-[200px]">
                    {report.reason}
                    {report.description && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {report.description}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {report.content_type}
                  </Badge>
                </TableCell>
                <TableCell>
                  {report.is_emergency ? (
                    <Badge variant="destructive" className="bg-red-600">Urgent</Badge>
                  ) : (
                    <Badge variant="outline">Normal</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(report.created_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => handleViewContent(report)}
                        className="cursor-pointer"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Content
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => {
                          setSelectedContent(report);
                          setDeleteDialog(true);
                        }}
                        className="cursor-pointer text-red-500"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Content
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => {
                          setSelectedContent(report);
                          setBanDialog(true);
                        }}
                        className="cursor-pointer text-red-500"
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        Ban User
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleMarkSafe(report.id)}
                        className="cursor-pointer text-green-500"
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Mark as Safe
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {(!data || data.length === 0) && (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-32 text-muted-foreground">
                  No flagged content found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* View content dialog */}
      <Dialog open={viewContentDialog} onOpenChange={setViewContentDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Reported Content</DialogTitle>
          </DialogHeader>
          {selectedContent && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="capitalize">
                  {selectedContent.content_type}
                </Badge>
                {selectedContent.is_emergency && (
                  <Badge variant="destructive" className="bg-red-600">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    Urgent Report
                  </Badge>
                )}
              </div>
              
              <div className="bg-[#0D1117] p-4 rounded-md border border-white/10">
                <h3 className="font-semibold mb-2">Report Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reason:</span>
                    <span>{selectedContent.reason}</span>
                  </div>
                  {selectedContent.description && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Description:</span>
                      <span>{selectedContent.description}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reported at:</span>
                    <span>{format(new Date(selectedContent.created_at), "PPpp")}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#0D1117] p-4 rounded-md border border-white/10">
                <h3 className="font-semibold mb-2">Content Preview</h3>
                {selectedContent.content_type === "post" && selectedContent.contentDetails && (
                  <div className="space-y-3">
                    <p>{selectedContent.contentDetails.content}</p>
                    {selectedContent.contentDetails.media_url && selectedContent.contentDetails.media_url.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {selectedContent.contentDetails.media_url.map((url: string, index: number) => (
                          <img 
                            key={index} 
                            src={url} 
                            alt={`Media ${index}`} 
                            className="w-full h-48 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {selectedContent.content_type === "dating_ad" && selectedContent.contentDetails && (
                  <div className="space-y-3">
                    <h4 className="font-medium">{selectedContent.contentDetails.title}</h4>
                    <p>{selectedContent.contentDetails.description}</p>
                    <p>{selectedContent.contentDetails.about_me}</p>
                  </div>
                )}
                
                {selectedContent.content_type === "message" && selectedContent.contentDetails && (
                  <div className="space-y-3">
                    <p>{selectedContent.contentDetails.content}</p>
                    {selectedContent.contentDetails.media_url && selectedContent.contentDetails.media_url.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {selectedContent.contentDetails.media_url.map((url: string, index: number) => (
                          <img 
                            key={index} 
                            src={url} 
                            alt={`Media ${index}`} 
                            className="w-full h-48 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {(!selectedContent.contentDetails || Object.keys(selectedContent.contentDetails).length === 0) && (
                  <p className="text-muted-foreground italic">
                    Content details not available or content may have been deleted
                  </p>
                )}
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleMarkSafe(selectedContent.id)}
                  className="bg-green-700/20 hover:bg-green-700/40 border-green-700/40 text-green-500"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Safe
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setViewContentDialog(false);
                    setBanDialog(true);
                  }}
                  className="bg-red-900/20 hover:bg-red-900/40 border-red-900/40 text-red-500"
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Ban User
                </Button>
                <Button
                  onClick={() => {
                    setViewContentDialog(false);
                    setDeleteDialog(true);
                  }}
                  variant="destructive"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Content
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Content</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this content? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteContent}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Ban user confirmation dialog */}
      <AlertDialog open={banDialog} onOpenChange={setBanDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ban User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to ban this user? They will no longer be able to access the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleBanUser}
              className="bg-red-600 hover:bg-red-700"
            >
              Ban User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

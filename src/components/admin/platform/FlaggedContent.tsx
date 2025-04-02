
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
  AlertTriangle, 
  Ban, 
  CheckCircle, 
  Eye, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Trash2
} from "lucide-react";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
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

export const FlaggedContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [contentTypeFilter, setContentTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'resolve' | 'delete' | 'ban' | null>(null);
  const [actionReason, setActionReason] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  const pageSize = 10;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch flagged content reports
  const { data, isLoading } = useQuery({
    queryKey: ["flagged-content", currentPage, contentTypeFilter, statusFilter, dateRange, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('reports')
        .select(`
          *,
          reporter:profiles!reports_reporter_id_fkey(username, avatar_url),
          reported:profiles!reports_reported_id_fkey(username, avatar_url)
        `, { count: 'exact' });

      // Apply content type filter
      if (contentTypeFilter !== "all") {
        query = query.eq('content_type', contentTypeFilter);
      }

      // Apply status filter
      if (statusFilter !== "all") {
        query = query.eq('status', statusFilter);
      }

      // Apply date range filter
      if (dateRange.from) {
        query = query.gte('created_at', dateRange.from.toISOString());
      }
      if (dateRange.to) {
        // Add one day to include reports from the last day
        const endDate = new Date(dateRange.to);
        endDate.setDate(endDate.getDate() + 1);
        query = query.lt('created_at', endDate.toISOString());
      }

      // Apply search term filter
      if (searchTerm) {
        query = query.or(`reason.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,reporter.username.ilike.%${searchTerm}%,reported.username.ilike.%${searchTerm}%`);
      }

      // Apply pagination
      const from = (currentPage - 1) * pageSize;
      query = query
        .range(from, from + pageSize - 1)
        .order('is_emergency', { ascending: false })
        .order('created_at', { ascending: false });

      const { data, error, count } = await query;
      
      if (error) throw error;
      return { reports: data, totalCount: count || 0 };
    },
  });

  // Handle report actions
  const handleReportAction = useMutation({
    mutationFn: async ({ 
      id, 
      action, 
      reason = null 
    }: { 
      id: string; 
      action: 'resolve' | 'delete' | 'ban'; 
      reason?: string | null 
    }) => {
      // Update report status
      const { error: reportError } = await supabase
        .from('reports')
        .update({
          status: action === 'resolve' ? 'resolved' : 'pending',
          action_taken: action,
          resolution_notes: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (reportError) throw reportError;
      
      // If action is ban, update the user's profile
      if (action === 'ban') {
        const report = data?.reports.find(r => r.id === id);
        
        if (report && report.reported_id) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              is_suspended: true,
              suspended_at: new Date().toISOString()
            })
            .eq('id', report.reported_id);
          
          if (profileError) throw profileError;
        }
      }

      // If action is delete, handle content deletion based on content type
      if (action === 'delete') {
        const report = data?.reports.find(r => r.id === id);
        
        if (report && report.content_id) {
          const { content_type, content_id } = report;
          
          // Delete the reported content based on its type
          let error;
          
          switch (content_type) {
            case 'post':
              ({ error } = await supabase
                .from('posts')
                .update({ visibility: 'deleted' })
                .eq('id', content_id));
              break;
            case 'message':
              ({ error } = await supabase
                .from('direct_messages')
                .update({ content: '[Content removed by moderator]' })
                .eq('id', content_id));
              break;
            case 'comment':
              ({ error } = await supabase
                .from('comments')
                .update({ content: '[Content removed by moderator]' })
                .eq('id', content_id));
              break;
            case 'dating_ad':
              ({ error } = await supabase
                .from('dating_ads')
                .update({ is_active: false })
                .eq('id', content_id));
              break;
            case 'video':
              ({ error } = await supabase
                .from('videos')
                .update({ visibility: 'deleted' })
                .eq('id', content_id));
              break;
          }
          
          if (error) throw error;
        }
      }
      
      // Log admin action
      await supabase.from('admin_logs').insert({
        admin_id: (await supabase.auth.getSession()).data.session?.user.id,
        action: `report_${action}`,
        action_type: `report_${action}`,
        target_id: id,
        target_type: 'report',
        details: {
          report_id: id,
          timestamp: new Date().toISOString(),
          reason: reason || undefined
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flagged-content"] });
      setActionDialogOpen(false);
      setActionReason("");
      
      const actionMessages = {
        resolve: "Report marked as resolved",
        delete: "Content deleted and report resolved",
        ban: "User banned and report resolved"
      };
      
      toast({
        title: "Action Complete",
        description: actionType ? actionMessages[actionType] : "Report updated",
      });
    },
    onError: (error) => {
      console.error("Error processing report action:", error);
      toast({
        title: "Action Failed",
        description: "There was an error processing this action",
        variant: "destructive",
      });
    }
  });

  // Handle bulk actions
  const handleBulkAction = useMutation({
    mutationFn: async ({ items, action }: { items: string[]; action: string }) => {
      for (const id of items) {
        // Update report status
        const { error } = await supabase
          .from('reports')
          .update({ 
            status: action === 'resolve' ? 'resolved' : 'dismissed',
            action_taken: action,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);

        if (error) throw error;
      }

      // Log admin action
      await supabase.from('admin_logs').insert({
        admin_id: (await supabase.auth.getSession()).data.session?.user.id,
        action: `bulk_report_${action}`,
        action_type: `bulk_report_${action}`,
        details: {
          report_ids: items,
          timestamp: new Date().toISOString()
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flagged-content"] });
      
      toast({
        title: "Bulk Action Completed",
        description: `Successfully processed ${selectedItems.length} reports`,
      });
      
      setSelectedItems([]);
    },
    onError: (error) => {
      console.error("Error processing bulk action:", error);
      toast({
        title: "Bulk Action Failed",
        description: "There was an error processing the selected reports",
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
      case 'reviewing':
        return <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">Reviewing</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Resolved</Badge>;
      case 'dismissed':
        return <Badge className="bg-gray-500/20 text-gray-500 border-gray-500/30">Dismissed</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-500 border-gray-500/30">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading flagged content..." />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 flex-wrap">
        <div className="relative w-full md:w-auto md:min-w-[250px] lg:flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search reports..."
            className="pl-10 bg-[#0D1117]/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
            <SelectTrigger className="w-[180px] bg-[#0D1117]/50">
              <SelectValue placeholder="Content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="post">Posts</SelectItem>
              <SelectItem value="message">Messages</SelectItem>
              <SelectItem value="comment">Comments</SelectItem>
              <SelectItem value="dating_ad">Dating Ads</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="user">User Reports</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-[#0D1117]/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewing">Reviewing</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="dismissed">Dismissed</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="w-full md:w-auto">
            <DateRangePicker
              from={dateRange.from}
              to={dateRange.to}
              onSelect={setDateRange}
            />
          </div>
        </div>
      </div>

      {/* Bulk actions */}
      {selectedItems.length > 0 && (
        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            className="bg-green-500/10 text-green-500 border-green-500/30 hover:bg-green-500/20"
            onClick={() => handleBulkAction.mutate({
              items: selectedItems,
              action: 'resolve'
            })}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Resolve {selectedItems.length} Selected
          </Button>
          <Button 
            variant="outline"
            size="sm"
            className="bg-gray-500/10 text-gray-500 border-gray-500/30 hover:bg-gray-500/20"
            onClick={() => handleBulkAction.mutate({
              items: selectedItems,
              action: 'dismiss'
            })}
          >
            <Ban className="mr-2 h-4 w-4" />
            Dismiss {selectedItems.length} Selected
          </Button>
        </div>
      )}

      <div className="rounded-md border border-white/10 overflow-hidden">
        <Table>
          <TableHeader className="bg-[#0D1117]">
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={data?.reports.length ? selectedItems.length === data.reports.length : false}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedItems(data?.reports.map(r => r.id) || []);
                    } else {
                      setSelectedItems([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reporter</TableHead>
              <TableHead>Reported</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                  No flagged content found matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              data?.reports.map((report) => (
                <TableRow key={report.id} className="border-white/5 hover:bg-[#0D1117]/50">
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(report.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedItems([...selectedItems, report.id]);
                        } else {
                          setSelectedItems(selectedItems.filter(id => id !== report.id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(report.status)}
                      {report.is_emergency && (
                        <Badge variant="destructive">URGENT</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="h-7 w-7 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                        {report.reporter?.avatar_url ? (
                          <img 
                            src={report.reporter.avatar_url} 
                            alt={report.reporter.username} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                        )}
                      </div>
                      <span className="text-sm">{report.reporter?.username || 'Unknown'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="h-7 w-7 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                        {report.reported?.avatar_url ? (
                          <img 
                            src={report.reported.avatar_url} 
                            alt={report.reported.username} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                        )}
                      </div>
                      <span className="text-sm">{report.reported?.username || 'Unknown'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {report.content_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[180px] truncate" title={report.reason}>
                      {report.reason}
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(report.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8 w-8 p-0 bg-[#0D1117]/50"
                        onClick={() => {
                          setSelectedItem(report);
                          setViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {report.status !== 'resolved' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 w-8 p-0 text-green-500 border-green-500/30 bg-green-500/10"
                            onClick={() => {
                              setSelectedItem(report);
                              setActionType('resolve');
                              setActionDialogOpen(true);
                            }}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 border-red-500/30 bg-red-500/10"
                            onClick={() => {
                              setSelectedItem(report);
                              setActionType('delete');
                              setActionDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 w-8 p-0 text-amber-500 border-amber-500/30 bg-amber-900/10"
                            onClick={() => {
                              setSelectedItem(report);
                              setActionType('ban');
                              setActionDialogOpen(true);
                            }}
                          >
                            <Ban className="h-4 w-4" />
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
          Showing {data?.reports.length ? ((currentPage - 1) * pageSize) + 1 : 0}-
          {Math.min(currentPage * pageSize, data?.totalCount || 0)} of {data?.totalCount || 0} reports
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

      {/* View Report Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Flagged Content Report</DialogTitle>
            <DialogDescription>
              Report filed on {selectedItem?.created_at && format(new Date(selectedItem.created_at), 'MMMM d, yyyy')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Reporter Details</h3>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                    {selectedItem?.reporter?.avatar_url ? (
                      <img 
                        src={selectedItem.reporter.avatar_url} 
                        alt={selectedItem.reporter.username} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{selectedItem?.reporter?.username || 'Unknown User'}</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Report Time: {selectedItem?.created_at && format(new Date(selectedItem.created_at), 'MMMM d, yyyy h:mm a')}</p>
                {selectedItem?.ip_address && (
                  <p className="text-sm text-muted-foreground">IP Address: {selectedItem.ip_address}</p>
                )}
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Reported Content</h3>
                <p className="text-sm">Type: <Badge>{selectedItem?.content_type}</Badge></p>
                <p className="text-sm">Status: {selectedItem && getStatusBadge(selectedItem.status)}</p>
                {selectedItem?.is_emergency && (
                  <p className="text-sm mt-2">
                    <Badge variant="destructive">URGENT REPORT</Badge>
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Report Reason</h3>
              <div className="p-3 bg-[#0D1117]/50 border border-white/10 rounded-md">
                <p className="text-sm">{selectedItem?.reason}</p>
              </div>
            </div>
            
            {selectedItem?.description && (
              <div>
                <h3 className="font-medium mb-2">Additional Details</h3>
                <div className="p-3 bg-[#0D1117]/50 border border-white/10 rounded-md">
                  <p className="text-sm">{selectedItem.description}</p>
                </div>
              </div>
            )}
            
            {selectedItem?.action_taken && (
              <div>
                <h3 className="font-medium mb-2">Action Taken</h3>
                <div className="p-3 bg-[#161B22] border border-white/10 rounded-md">
                  <p className="text-sm">
                    <span className="font-medium">Action:</span> {selectedItem.action_taken}
                  </p>
                  {selectedItem?.resolution_notes && (
                    <p className="text-sm mt-2">
                      <span className="font-medium">Notes:</span> {selectedItem.resolution_notes}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              {selectedItem?.status !== 'resolved' && (
                <>
                  <Button 
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setViewDialogOpen(false);
                      setActionType('ban');
                      setActionDialogOpen(true);
                    }}
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    Ban User
                  </Button>
                  <Button 
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setViewDialogOpen(false);
                      setActionType('delete');
                      setActionDialogOpen(true);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Content
                  </Button>
                </>
              )}
            </div>
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
              {actionType === 'resolve' ? 'Resolve Report' : 
               actionType === 'delete' ? 'Delete Flagged Content' : 
               'Ban Reported User'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'resolve' ? 'This will mark the report as resolved without taking further action.' : 
               actionType === 'delete' ? 'This will delete the reported content and mark the report as resolved.' : 
               'This will ban the reported user and mark the report as resolved.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-2">
            <Textarea
              placeholder={`Enter reason for ${actionType === 'resolve' ? 'resolution' : 
                                              actionType === 'delete' ? 'content deletion' : 
                                              'user ban'}...`}
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              className="min-h-[100px] bg-[#0D1117]/50"
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => {
                setActionDialogOpen(false);
                setActionReason("");
              }}
            >
              Cancel
            </Button>
            <Button 
              variant={actionType === 'resolve' ? 'default' : 'destructive'}
              onClick={() => {
                if (selectedItem && actionType) {
                  handleReportAction.mutate({
                    id: selectedItem.id,
                    action: actionType,
                    reason: actionReason
                  });
                }
              }}
              disabled={!actionReason}
            >
              {actionType === 'resolve' ? 'Resolve Report' : 
               actionType === 'delete' ? 'Delete Content' : 
               'Ban User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

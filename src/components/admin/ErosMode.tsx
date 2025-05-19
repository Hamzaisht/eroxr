import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow, format } from "date-fns";
import { 
  Shield, 
  AlertTriangle, 
  Ban, 
  CheckCircle, 
  Download, 
  Search, 
  Filter,
  Eye,
  Calendar,
  ChevronUp,
  ChevronDown,
  FileJson,
  FileSpreadsheet
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { asColumnValue, asStringValue } from "@/utils/supabase/helpers";
import { updateRecord, updateRecords } from "@/utils/supabase/recordUpdaters";

interface Report {
  id: string;
  content_type: string;
  reason: string;
  status: string;
  created_at: string;
  is_emergency: boolean;
  reporter_id: string;
  reported_id: string;
  reporter: Profile;
  reported: Profile;
}

interface DMCARequest {
  id: string;
  content_type: string;
  status: string;
  created_at: string;
  reporter_id: string;
  reporter: Profile;
}

interface ContentClassification {
  id: string;
  content_type: string;
  classification: string;
  visibility: string;
  created_at: string;
}

interface Profile {
  id: string;
  username: string;
}

export const ErosMode = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });
  const [sortConfig, setSortConfig] = useState<{ field: string; direction: 'asc' | 'desc' }>({ field: 'created_at', direction: 'desc' });
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const isGodMode = session?.user?.email?.toLowerCase() === 'hamzaishtiaq242@gmail.com';
  
  if (!isGodMode) {
    console.log("Access denied to God Mode. Current user email:", session?.user?.email);
    toast({
      title: "Access Denied",
      description: "You don't have permission to access this area.",
      variant: "destructive",
    });
    navigate('/');
    return null;
  }

  const handleBulkAction = useMutation({
    mutationFn: async ({ items, action }: { items: string[]; action: string }) => {
      const result = await updateRecords('reports', items, { status: action });
      if (result.error) throw result.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
      toast({
        title: "Bulk Action Completed",
        description: "Selected items have been updated.",
      });
      setSelectedItems([]);
    },
  });

  const handleExport = (data: any[], type: string, format: 'csv' | 'json' | 'xlsx') => {
    let content: string;
    let mimeType: string;
    let fileExtension: string;

    switch (format) {
      case 'json':
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/json';
        fileExtension = 'json';
        break;
      case 'xlsx':
        content = data.map(item => Object.values(item).join(',')).join('\n');
        mimeType = 'text/csv';
        fileExtension = 'csv';
        break;
      default:
        content = data.map(item => Object.values(item).join(',')).join('\n');
        mimeType = 'text/csv';
        fileExtension = 'csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${type}_export_${Date.now()}.${fileExtension}`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSort = (field: string) => {
    setSortConfig({
      field,
      direction: sortConfig.field === field && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const filterAndSortData = (data: any[]) => {
    return data
      ?.filter(item => {
        const matchesSearch = 
          item.content_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.reason?.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesStatus = statusFilter === "all" || item.status === statusFilter;
        
        const matchesDateRange = 
          !dateRange.from || !dateRange.to || 
          (new Date(item.created_at) >= dateRange.from && 
           new Date(item.created_at) <= dateRange.to);
        
        return matchesSearch && matchesStatus && matchesDateRange;
      })
      .sort((a, b) => {
        const aValue = a[sortConfig.field];
        const bValue = b[sortConfig.field];
        const modifier = sortConfig.direction === 'asc' ? 1 : -1;
        
        if (typeof aValue === 'string') {
          return aValue.localeCompare(bValue) * modifier;
        }
        return ((aValue < bValue ? -1 : 1) * modifier);
      });
  };

  const handleReport = useMutation({
    mutationFn: async ({ reportId, action }: { reportId: string; action: string }) => {
      const result = await updateRecord('reports', reportId, {
        status: action === 'dismiss' ? 'dismissed' : 'resolved',
        action_taken: action
      });
      if (result.error) throw result.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
      toast({
        title: "Report Updated",
        description: "The report has been successfully handled.",
      });
    },
  });

  const handleDMCA = useMutation({
    mutationFn: async ({ requestId, action }: { requestId: string; action: 'approve' | 'reject' }) => {
      const result = await updateRecord('dmca_requests', requestId, {
        status: action === 'approve' ? 'approved' : 'rejected',
        takedown_date: action === 'approve' ? new Date().toISOString() : null
      });
      if (result.error) throw result.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dmca'] });
      toast({
        title: "DMCA Request Updated",
        description: "The DMCA request has been processed.",
      });
    },
  });

  const handleClassification = useMutation({
    mutationFn: async ({ 
      classificationId, 
      visibility 
    }: { 
      classificationId: string; 
      visibility: string 
    }) => {
      const result = await updateRecord('content_classifications', classificationId, { visibility });
      if (result.error) throw result.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-classifications'] });
      toast({
        title: "Classification Updated",
        description: "The content classification has been updated.",
      });
    },
  });

  const { data: reports } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          id,
          content_type,
          reason,
          status,
          created_at,
          is_emergency,
          reporter_id,
          reported_id,
          reporter:profiles!reporter_id (username),
          reported:profiles!reported_id (username)
        `)
        .order('is_emergency', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as Report[];
    }
  });

  const { data: dmcaRequests } = useQuery({
    queryKey: ['admin-dmca'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dmca_requests')
        .select(`
          id,
          content_type,
          status,
          created_at,
          reporter_id,
          reporter:profiles!reporter_id (username)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as DMCARequest[];
    }
  });

  const { data: classificationsData } = useQuery({
    queryKey: ['admin-classifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_classifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    }
  });

  // Safe casting for the classifications data
  const classifications: ContentClassification[] = classificationsData as unknown as ContentClassification[];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'reviewing':
        return 'bg-blue-500/10 text-blue-500';
      case 'resolved':
        return 'bg-green-500/10 text-green-500';
      case 'dismissed':
        return 'bg-gray-500/10 text-gray-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-luxury-neutral">Eros Mode Control Panel</h1>
        <Badge variant="destructive" className="px-2 py-1">GOD MODE</Badge>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="dismissed">Dismissed</SelectItem>
          </SelectContent>
        </Select>

        <DateRangePicker
          from={dateRange.from}
          to={dateRange.to}
          onSelect={(range) => setDateRange(range)}
        />
      </div>

      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reports">
            Active Reports ({reports?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="dmca">
            DMCA Requests ({dmcaRequests?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="classifications">
            Content Classifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="mt-4">
          <Card className="p-4">
            <div className="flex justify-between mb-4">
              <div className="flex gap-2">
                {selectedItems.length > 0 && (
                  <>
                    <Button 
                      variant="outline"
                      onClick={() => handleBulkAction.mutate({
                        items: selectedItems,
                        action: 'resolved'
                      })}
                    >
                      Resolve Selected ({selectedItems.length})
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleBulkAction.mutate({
                        items: selectedItems,
                        action: 'dismissed'
                      })}
                    >
                      Dismiss Selected ({selectedItems.length})
                    </Button>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleExport(reports || [], 'reports', 'json')}
                >
                  <FileJson className="w-4 h-4 mr-2" />
                  Export JSON
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExport(reports || [], 'reports', 'xlsx')}
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Export Excel
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={selectedItems.length === reports?.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedItems(reports?.map(r => r.id) || []);
                          } else {
                            setSelectedItems([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('status')}
                    >
                      Status {sortConfig.field === 'status' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="inline w-4 h-4" /> : <ChevronDown className="inline w-4 h-4" />
                      )}
                    </TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Reported</TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('content_type')}
                    >
                      Type {sortConfig.field === 'content_type' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="inline w-4 h-4" /> : <ChevronDown className="inline w-4 h-4" />
                      )}
                    </TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('created_at')}
                    >
                      Time {sortConfig.field === 'created_at' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="inline w-4 h-4" /> : <ChevronDown className="inline w-4 h-4" />
                      )}
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterAndSortData(reports)?.map((report) => (
                    <TableRow key={report.id}>
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
                        <Badge className={getStatusColor(report.status)}>
                          {report.status.toUpperCase()}
                        </Badge>
                        {report.is_emergency && (
                          <Badge variant="destructive" className="ml-2">
                            URGENT
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{report.reporter?.username}</TableCell>
                      <TableCell>{report.reported?.username}</TableCell>
                      <TableCell>{report.content_type}</TableCell>
                      <TableCell>{report.reason}</TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Detailed Report View</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h3 className="font-medium">Reporter Details</h3>
                                    <p>Username: {report.reporter?.username}</p>
                                    <p>Report Time: {new Date(report.created_at).toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <h3 className="font-medium">Reported Content</h3>
                                    <p>Type: {report.content_type}</p>
                                    <p>Status: {report.status}</p>
                                  </div>
                                </div>
                                <div>
                                  <h3 className="font-medium">Reason</h3>
                                  <p>{report.reason}</p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Shield className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Review Report</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to review this report?
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button 
                                  onClick={() => handleReport.mutate({ 
                                    reportId: report.id, 
                                    action: 'review'
                                  })}
                                >
                                  Confirm Review
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Ban className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Ban User</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to ban this user?
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button 
                                  variant="destructive"
                                  onClick={() => handleReport.mutate({ 
                                    reportId: report.id, 
                                    action: 'ban'
                                  })}
                                >
                                  Confirm Ban
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Dismiss Report</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to dismiss this report?
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button 
                                  onClick={() => handleReport.mutate({ 
                                    reportId: report.id, 
                                    action: 'dismiss'
                                  })}
                                >
                                  Confirm Dismiss
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="dmca" className="mt-4">
          <Card className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Content Type</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dmcaRequests?.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{request.reporter?.username}</TableCell>
                    <TableCell>{request.content_type}</TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <AlertTriangle className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reject DMCA Request</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to reject this DMCA request?
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button 
                                variant="destructive"
                                onClick={() => handleDMCA.mutate({ 
                                  requestId: request.id, 
                                  action: 'reject'
                                })}
                              >
                                Confirm Reject
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Approve DMCA Request</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to approve this DMCA takedown request?
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button 
                                onClick={() => handleDMCA.mutate({ 
                                  requestId: request.id, 
                                  action: 'approve'
                                })}
                              >
                                Confirm Approval
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="classifications" className="mt-4">
          <Card className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Content Type</TableHead>
                  <TableHead>Classification</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classifications?.map((classification) => (
                  <TableRow key={classification.id}>
                    <TableCell>{classification.content_type}</TableCell>
                    <TableCell>
                      <Badge>
                        {classification.classification.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{classification.visibility}</TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(classification.created_at), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Update Content Visibility</DialogTitle>
                            <DialogDescription>
                              Choose the new visibility setting for this content.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4">
                            <Button 
                              onClick={() => handleClassification.mutate({
                                classificationId: classification.id,
                                visibility: 'public'
                              })}
                            >
                              Make Public
                            </Button>
                            <Button 
                              onClick={() => handleClassification.mutate({
                                classificationId: classification.id,
                                visibility: 'private'
                              })}
                            >
                              Make Private
                            </Button>
                            <Button 
                              onClick={() => handleClassification.mutate({
                                classificationId: classification.id,
                                visibility: 'subscribers_only'
                              })}
                            >
                              Subscribers Only
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

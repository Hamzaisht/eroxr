import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Shield, AlertTriangle, Ban, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";

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
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if user is super admin
  const isGodMode = session?.user?.email === 'hamzaishtiaq242@gmail.com';

  if (!isGodMode) {
    navigate('/');
    return null;
  }

  // Mutation for handling reports
  const handleReport = useMutation({
    mutationFn: async ({ reportId, action }: { reportId: string; action: string }) => {
      const { error } = await supabase
        .from('reports')
        .update({ 
          status: action === 'dismiss' ? 'dismissed' : 'resolved',
          action_taken: action
        })
        .eq('id', reportId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
      toast({
        title: "Report Updated",
        description: "The report has been successfully handled.",
      });
    },
  });

  // Mutation for handling DMCA requests
  const handleDMCA = useMutation({
    mutationFn: async ({ requestId, action }: { requestId: string; action: 'approve' | 'reject' }) => {
      const { error } = await supabase
        .from('dmca_requests')
        .update({ 
          status: action === 'approve' ? 'approved' : 'rejected',
          takedown_date: action === 'approve' ? new Date().toISOString() : null
        })
        .eq('id', requestId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dmca'] });
      toast({
        title: "DMCA Request Updated",
        description: "The DMCA request has been processed.",
      });
    },
  });

  // Mutation for handling content classifications
  const handleClassification = useMutation({
    mutationFn: async ({ 
      classificationId, 
      visibility 
    }: { 
      classificationId: string; 
      visibility: string 
    }) => {
      const { error } = await supabase
        .from('content_classifications')
        .update({ visibility })
        .eq('id', classificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-classifications'] });
      toast({
        title: "Classification Updated",
        description: "The content classification has been updated.",
      });
    },
  });

  // Fetch active reports
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
      return data as unknown as Report[];
    }
  });

  // Fetch DMCA requests
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
      return data as unknown as DMCARequest[];
    }
  });

  // Fetch content classifications
  const { data: classifications } = useQuery({
    queryKey: ['admin-classifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_classifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as ContentClassification[];
    }
  });

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

      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reports">Active Reports ({reports?.length || 0})</TabsTrigger>
          <TabsTrigger value="dmca">DMCA Requests ({dmcaRequests?.length || 0})</TabsTrigger>
          <TabsTrigger value="classifications">Content Classifications</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="mt-4">
          <Card className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Reported</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports?.map((report) => (
                  <TableRow key={report.id}>
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

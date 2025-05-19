
import React, { useState } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';
import { 
  asReportStatus, 
  asColumnName
} from '@/utils/supabase/helpers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Ban, 
  CheckCircle, 
  Clock, 
  Flag, 
  MessageSquare, 
  ShieldAlert, 
  Trash2, 
  User, 
  X 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types/database.types';

// Define TypeScript interfaces for our data
interface Report {
  id: string;
  content_type: string;
  reason: string;
  status: string;
  created_at: string;
  is_emergency: boolean;
  reporter_id: string;
  reported_id: string;
  reporter?: {
    username: string;
  };
  reported?: {
    username: string;
  };
}

export const ErosMode: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('reports');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch reports data
  const { data: reportsData, isLoading: isLoadingReports } = useQuery({
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
          reporter:reporter_id(username),
          reported:reported_id(username)
        `)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching reports:', error);
        throw error;
      }
      
      // Safely cast the data to our Report type
      return (data || []) as unknown as Report[];
    }
  });

  // Handle resolving reports
  const handleResolveReport = async (reportId: string, action: 'approve' | 'reject' | 'delete') => {
    if (!session?.user?.id) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to perform this action',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const status = action === 'approve' ? 'resolved' : 'rejected';
      
      const { error } = await supabase
        .from('reports')
        .update({ 
          status: asReportStatus(status),
          resolved_by: session.user.id,
        })
        .eq(asColumnName<Database["public"]["Tables"]["reports"]["Row"]>("id"), reportId);
        
      if (error) throw error;
      
      // Log admin action
      await supabase
        .from('admin_logs')
        .insert({
          admin_id: session.user.id,
          action: `report_${action}`,
          action_type: 'moderation',
          target_id: reportId,
          target_type: 'report',
          details: { action }
        });
        
      toast({
        title: 'Report updated',
        description: `The report has been ${status}`,
      });
      
      // Invalidate reports query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
      
    } catch (error: any) {
      console.error('Error resolving report:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update report status',
        variant: 'destructive',
      });
    }
  };
  
  // Filter reports based on search and status
  const filteredReports = reportsData?.filter(report => {
    // Apply status filter
    if (filterStatus !== 'all' && report.status !== filterStatus) {
      return false;
    }
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        report.content_type?.toLowerCase().includes(searchLower) ||
        report.reason?.toLowerCase().includes(searchLower) ||
        report.reporter?.username?.toLowerCase().includes(searchLower) ||
        report.reported?.username?.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  }) || [];
  
  // Helper function to get badge color based on report status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-600 text-white';
      case 'resolved': return 'bg-green-600 text-white';
      case 'rejected': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  // Helper function to get icon based on content type
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'user': return <User className="h-4 w-4" />;
      case 'post': return <MessageSquare className="h-4 w-4" />;
      case 'message': return <MessageSquare className="h-4 w-4" />;
      case 'profile': return <User className="h-4 w-4" />;
      default: return <Flag className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <ShieldAlert className="mr-2 h-6 w-6 text-red-500" />
            EROS Mode
          </h1>
          <p className="text-muted-foreground">Advanced content moderation and administrative tools</p>
        </div>
      </header>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="reports" className="relative">
            Reports
            {reportsData?.filter(r => r.status === 'pending').length ? (
              <Badge variant="destructive" className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                {reportsData?.filter(r => r.status === 'pending').length}
              </Badge>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="content">Content Review</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reports" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="sm:max-w-sm"
            />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="sm:w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {isLoadingReports ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredReports.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No reports match your criteria</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredReports.map((report) => (
                <Card key={report.id} className={report.is_emergency ? 'border-red-500' : ''}>
                  <CardHeader className="p-4 pb-2 flex flex-row justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getContentTypeIcon(report.content_type)}
                        {report.content_type}
                      </Badge>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                      {report.is_emergency && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Emergency
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(report.created_at).toLocaleString()}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-3">
                    <div>
                      <h3 className="font-medium">Reason:</h3>
                      <p>{report.reason}</p>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div>
                        <p className="text-xs text-muted-foreground">Reported by:</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>{report.reporter?.username?.[0] || '?'}</AvatarFallback>
                          </Avatar>
                          <span>{report.reporter?.username || 'Unknown'}</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground">Reported user:</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>{report.reported?.username?.[0] || '?'}</AvatarFallback>
                          </Avatar>
                          <span>{report.reported?.username || 'Unknown'}</span>
                        </div>
                      </div>
                    </div>
                    
                    {report.status === 'pending' && (
                      <div className="flex items-center gap-2 pt-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="default"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleResolveReport(report.id, 'approve')}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Resolve
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Mark as resolved and take action</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleResolveReport(report.id, 'reject')}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Dismiss
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Dismiss this report</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleResolveReport(report.id, 'delete')}
                              >
                                <Ban className="h-4 w-4 mr-1" />
                                Ban User
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Ban the reported user</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Content Review</h3>
            </CardHeader>
            <CardContent>
              <p>Content moderation tools will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">User Management</h3>
            </CardHeader>
            <CardContent>
              <p>User management tools will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

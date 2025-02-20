
import { useQuery } from "@tanstack/react-query";
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

interface Report {
  id: string;
  content_type: string;
  reason: string;
  status: string;
  created_at: string;
  is_emergency: boolean;
  reporter: { username: string };
  reported: { username: string };
}

interface DMCARequest {
  id: string;
  content_type: string;
  status: string;
  created_at: string;
  reporter: { username: string };
}

interface ContentClassification {
  id: string;
  content_type: string;
  classification: string;
  visibility: string;
  created_at: string;
}

export const ErosMode = () => {
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
          reporter:reporter_id(username),
          reported:reported_id(username)
        `)
        .order('is_emergency', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as Report[];
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
          reporter:reporter_id(username)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as DMCARequest[];
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
        <TabsList>
          <TabsTrigger value="reports">Active Reports</TabsTrigger>
          <TabsTrigger value="dmca">DMCA Requests</TabsTrigger>
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
                    <TableCell>{report.reporter.username}</TableCell>
                    <TableCell>{report.reported.username}</TableCell>
                    <TableCell>{report.content_type}</TableCell>
                    <TableCell>{report.reason}</TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Shield className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Ban className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <CheckCircle className="w-4 h-4" />
                        </Button>
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
                    <TableCell>{request.reporter.username}</TableCell>
                    <TableCell>{request.content_type}</TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <AlertTriangle className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <CheckCircle className="w-4 h-4" />
                        </Button>
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
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
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

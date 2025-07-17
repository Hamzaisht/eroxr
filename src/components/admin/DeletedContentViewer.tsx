import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminSession } from '@/contexts/AdminSessionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Eye, Search, Ghost, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DeletedContent {
  id: string;
  content_type: 'post' | 'message' | 'stream' | 'story';
  original_content: any;
  deleted_at: string;
  deleted_by: string;
  deletion_reason?: string;
  forensic_data?: any;
}

export const DeletedContentViewer: React.FC = () => {
  const { isGhostMode, logGhostAction } = useAdminSession();
  const [deletedContent, setDeletedContent] = useState<DeletedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    if (isGhostMode) {
      fetchDeletedContent();
    }
  }, [isGhostMode, searchTerm, selectedType]);

  const fetchDeletedContent = async () => {
    try {
      setLoading(true);
      
      // Since we don't have a deleted_content table, we'll simulate with flagged content
      // In a real implementation, you'd have a proper deleted_content table
      let query = supabase
        .from('flagged_content')
        .select(`
          id,
          content_id,
          content_type,
          reason,
          flagged_at,
          flagged_by,
          notes,
          status
        `)
        .eq('status', 'resolved');

      if (selectedType !== 'all') {
        query = query.eq('content_type', selectedType);
      }

      if (searchTerm) {
        query = query.ilike('notes', `%${searchTerm}%`);
      }

      const { data, error } = await query
        .order('flagged_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Transform flagged content to deleted content format
      const transformedData: DeletedContent[] = (data || []).map(item => ({
        id: item.id,
        content_type: item.content_type as any,
        original_content: {
          id: item.content_id,
          reason: item.reason,
          notes: item.notes
        },
        deleted_at: item.flagged_at,
        deleted_by: item.flagged_by || 'system',
        deletion_reason: item.reason,
        forensic_data: {
          status: item.status,
          flagged_by: item.flagged_by
        }
      }));

      setDeletedContent(transformedData);
    } catch (error) {
      console.error('Error fetching deleted content:', error);
      toast({
        title: "Error",
        description: "Failed to fetch deleted content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const viewDeletedContent = async (content: DeletedContent) => {
    if (!isGhostMode) {
      toast({
        title: "Access Denied",
        description: "Ghost Mode required for forensic access",
        variant: "destructive"
      });
      return;
    }

    try {
      await logGhostAction('view_deleted_content', content.content_type, content.id, {
        deletion_reason: content.deletion_reason,
        deleted_at: content.deleted_at,
        forensic_access: true,
        content_type: content.content_type
      });

      toast({
        title: "Forensic Access Logged",
        description: `Viewed deleted ${content.content_type}`,
      });
    } catch (error) {
      console.error('Error logging forensic access:', error);
    }
  };

  if (!isGhostMode) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Ghost Mode Required</h3>
          <p>Enable Ghost Mode to access deleted content forensics</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Ghost className="h-6 w-6 text-purple-500" />
          <h1 className="text-2xl font-bold">Deleted Content Forensics</h1>
          <Badge variant="outline" className="border-purple-500 text-purple-500">
            Ghost Mode Active
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search deleted content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">All Types</option>
              <option value="post">Posts</option>
              <option value="message">Messages</option>
              <option value="stream">Streams</option>
              <option value="story">Stories</option>
            </select>
            <Button onClick={fetchDeletedContent} variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Deleted Content List */}
      <div className="grid gap-4">
        {loading ? (
          <Card className="p-8">
            <div className="text-center text-muted-foreground">
              Loading deleted content...
            </div>
          </Card>
        ) : deletedContent.length === 0 ? (
          <Card className="p-8">
            <div className="text-center text-muted-foreground">
              No deleted content found
            </div>
          </Card>
        ) : (
          deletedContent.map((content) => (
            <Card key={content.id} className="border-red-200 dark:border-red-800">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4 text-red-500" />
                      <span className="font-medium">Deleted {content.content_type}</span>
                      <Badge variant="destructive" className="text-xs">
                        DELETED
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p><strong>Content ID:</strong> {content.original_content?.id || content.id}</p>
                      <p><strong>Deleted:</strong> {new Date(content.deleted_at).toLocaleString()}</p>
                      <p><strong>Reason:</strong> {content.deletion_reason || 'Unknown'}</p>
                      {content.original_content?.notes && (
                        <p><strong>Notes:</strong> {content.original_content.notes}</p>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => viewDeletedContent(content)}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Forensic View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
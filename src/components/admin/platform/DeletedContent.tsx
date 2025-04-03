import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrashIcon, Eye, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ModerationAction } from "@/types/moderation";
import { format } from 'date-fns';

interface DeletedContentItem {
  id: string;
  content_type: string;
  content: string;
  created_at: string;
  deleted_at: string;
  reason: string;
  user_id: string;
  username: string;
  media_url: string[];
}

export const DeletedContent = () => {
  const [deletedContent, setDeletedContent] = useState<DeletedContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<DeletedContentItem | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  useEffect(() => {
    const fetchDeletedContent = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('deleted_content')
          .select('*');

        if (error) {
          setError(error.message);
        } else {
          setDeletedContent(data || []);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeletedContent();
  }, [supabase]);

  const handleRestoreContent = async (id: string, contentType: string) => {
    try {
      // 1. Move the content back to its original table
      let content;
      if (contentType === 'post') {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        content = data;
      } else if (contentType === 'comment') {
        const { data, error } = await supabase
          .from('comments')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        content = data;
      } else {
        throw new Error(`Unsupported content type: ${contentType}`);
      }

      // 2. Delete the content from the deleted_content table
      const { error: deleteError } = await supabase
        .from('deleted_content')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Optimistically update the UI
      setDeletedContent(prevContent => prevContent.filter(item => item.id !== id));

      toast({
        title: "Content Restored",
        description: `The ${contentType} has been successfully restored.`,
      });
    } catch (error: any) {
      toast({
        title: "Error Restoring Content",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Deleted Content</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Deleted At</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deletedContent.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.content_type}</TableCell>
                  <TableCell>{item.content.substring(0, 50)}...</TableCell>
                  <TableCell>{format(new Date(item.deleted_at), 'MMM d, yyyy h:mm a')}</TableCell>
                  <TableCell>{item.reason}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedContent(item);
                          setOpenDialog(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRestoreContent(item.id, item.content_type)}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Dialog to display full content */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deleted Content Details</DialogTitle>
            <DialogDescription>
              View the full content and details of the deleted item.
            </DialogDescription>
          </DialogHeader>
          {selectedContent && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Content</h3>
                <p className="text-muted-foreground">{selectedContent.content}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium">Reason</h3>
                <p className="text-muted-foreground">{selectedContent.reason}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium">Deleted At</h3>
                <p className="text-muted-foreground">{format(new Date(selectedContent.deleted_at), 'MMM d, yyyy h:mm a')}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

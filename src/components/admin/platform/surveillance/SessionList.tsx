
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchFilterBar, SearchFilter } from "./components/SearchFilterBar";
import { SessionActions } from "./components/session/SessionActions";
import { LiveSession } from "./types";
import { ModerationAction } from "@/types/surveillance";
import { LoadingState } from "@/components/ui/LoadingState";

interface SessionListProps {
  sessions?: LiveSession[];
  isLoading: boolean;
  onMonitorSession: (session: LiveSession) => Promise<boolean>;
  error: string | null;
  onShowMediaPreview?: (session: LiveSession) => void;
  onModerate?: (session: LiveSession, action: ModerationAction, editedContent?: string) => Promise<void>;
  actionInProgress?: string | null;
}

export const SessionList = ({ 
  sessions = [],
  isLoading,
  onMonitorSession,
  error,
  onShowMediaPreview,
  onModerate,
  actionInProgress
}: SessionListProps) => {
  const [selectedSession, setSelectedSession] = useState<LiveSession | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState<SearchFilter>({ query: '' });
  const { toast } = useToast();

  const handleSearch = (filters: SearchFilter) => {
    setSearchFilter(filters);
  };

  const handleRefresh = () => {
    toast({
      title: "Sessions Refreshed!",
      description: "The session list has been updated.",
    });
  };

  const handleModerateAction = async (session: LiveSession, action: ModerationAction, editedContent?: string) => {
    if (onModerate) {
      await onModerate(session, action, editedContent);
    }
  };

  const handleShowMedia = (session: LiveSession) => {
    if (onShowMediaPreview) {
      onShowMediaPreview(session);
    }
  };

  // Filter sessions based on search query
  const filteredSessions = sessions.filter(session => {
    const searchQuery = searchFilter.query.toLowerCase();
    if (!searchQuery) return true;
    
    const titleMatch = session.title?.toLowerCase().includes(searchQuery);
    const usernameMatch = session.username?.toLowerCase().includes(searchQuery);
    const contentMatch = session.content?.toLowerCase().includes(searchQuery);
    
    return titleMatch || usernameMatch || contentMatch;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Live Sessions</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="h-9"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <SearchFilterBar 
            onSearch={handleSearch} 
            onRefresh={handleRefresh}
            placeholder="Search sessions..."
          />
        </div>
      </div>
      
      <ScrollArea className="rounded-md border h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead>Started At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  <LoadingState message="Loading sessions..." />
                </TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-red-500">
                  Error: {error}
                </TableCell>
              </TableRow>
            )}
            {!isLoading && filteredSessions.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <Eye className="h-12 w-12 text-muted-foreground/30" />
                    <p className="text-muted-foreground">No sessions found</p>
                    <Button size="sm" onClick={handleRefresh} variant="outline">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Refresh
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!isLoading && filteredSessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>
                  <div className="font-medium">{session.title || 'Untitled'}</div>
                  <div className="text-sm text-muted-foreground">{session.description || session.content?.substring(0, 50)}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {session.username || session.user_id}
                  </div>
                </TableCell>
                <TableCell>
                  {session.created_at ? new Date(session.created_at).toLocaleTimeString() : 'Unknown'}
                </TableCell>
                <TableCell className="text-right">
                  {onModerate && onShowMediaPreview ? (
                    <SessionActions 
                      session={session}
                      onMonitorSession={onMonitorSession}
                      onShowMediaPreview={handleShowMedia}
                      onModerate={handleModerateAction}
                      actionInProgress={actionInProgress || null}
                    />
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onMonitorSession(session)}
                    >
                      Monitor
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Session Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {selectedSession && (
              <>
                <div>
                  <h3 className="font-medium">Title</h3>
                  <p>{selectedSession.title || 'Untitled'}</p>
                </div>
                <div>
                  <h3 className="font-medium">Creator</h3>
                  <p>{selectedSession.username || selectedSession.user_id}</p>
                </div>
                {selectedSession.content && (
                  <div>
                    <h3 className="font-medium">Content</h3>
                    <p>{selectedSession.content}</p>
                  </div>
                )}
                {selectedSession.created_at && (
                  <div>
                    <h3 className="font-medium">Created At</h3>
                    <p>{new Date(selectedSession.created_at).toLocaleString()}</p>
                  </div>
                )}
              </>
            )}
          </div>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

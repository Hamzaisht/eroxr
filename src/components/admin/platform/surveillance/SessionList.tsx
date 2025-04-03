
import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Tv, UserCog, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchFilterBar, SearchFilter } from "./components/SearchFilterBar";
import { SessionActions } from "./components/session/SessionActions";
import { LiveSession } from "./types";
import { ModerationAction } from "@/types/moderation";

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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Live Sessions</h2>
        <SearchFilterBar 
          onSearch={handleSearch} 
          onRefresh={handleRefresh}
          placeholder="Search sessions..."
        />
      </div>
      
      <ScrollArea className="rounded-md border">
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
                <TableCell colSpan={4} className="text-center py-4 italic text-muted-foreground">
                  Loading sessions...
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
            {!isLoading && sessions.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No live sessions found.
                </TableCell>
              </TableRow>
            )}
            {sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>
                  <div className="font-medium">{session.title || 'Untitled'}</div>
                  <div className="text-sm text-muted-foreground">{session.description || session.content?.substring(0, 50)}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Tv className="h-4 w-4 text-muted-foreground" />
                    <span>{session.creator_id || session.user_id}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(session.created_at).toLocaleTimeString()}
                </TableCell>
                <TableCell className="text-right">
                  {onModerate && onShowMediaPreview && (
                    <SessionActions 
                      session={session}
                      onMonitorSession={onMonitorSession}
                      onShowMediaPreview={handleShowMedia}
                      onModerate={handleModerateAction}
                      actionInProgress={actionInProgress || null}
                    />
                  )}
                  {!onModerate && (
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
            <DialogDescription>
              {selectedSession?.title} - {selectedSession?.description}
            </DialogDescription>
          </DialogHeader>
          {/* Add session details here */}
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

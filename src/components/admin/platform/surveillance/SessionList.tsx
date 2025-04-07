
import { useState } from "react";
import { LiveSession } from "./types";
import { ModerationAction } from "@/types/moderation";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { SearchFilter } from "./components/SearchFilterBar";
import { SessionHeader } from "./components/SessionHeader";
import { SessionTable } from "./components/SessionTable";

interface SessionListProps {
  sessions?: LiveSession[];
  isLoading: boolean;
  onMonitorSession: (session: LiveSession) => Promise<boolean>;
  error: string | null;
  onShowMediaPreview?: (session: LiveSession) => void;
  onModerate?: (session: LiveSession, action: ModerationAction, editedContent?: string) => Promise<void>;
  actionInProgress?: string | null;
  onRefresh?: () => void;
}

export const SessionList = ({ 
  sessions = [],
  isLoading,
  onMonitorSession,
  error,
  onShowMediaPreview,
  onModerate,
  actionInProgress,
  onRefresh
}: SessionListProps) => {
  const [selectedSession, setSelectedSession] = useState<LiveSession | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState<SearchFilter>({ query: '' });
  const { toast } = useToast();

  const handleSearch = (filters: SearchFilter) => {
    setSearchFilter(filters);
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      toast({
        title: "Sessions Refreshed!",
        description: "The session list has been updated.",
      });
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
      <SessionHeader 
        onRefresh={handleRefresh} 
        onSearch={handleSearch}
      />
      
      <ScrollArea className="rounded-md border h-[400px]">
        <SessionTable
          sessions={filteredSessions}
          isLoading={isLoading}
          error={error}
          onMonitorSession={onMonitorSession}
          onRefresh={handleRefresh}
          onShowMediaPreview={onShowMediaPreview}
          onModerate={onModerate}
          actionInProgress={actionInProgress}
        />
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
                  <p>{selectedSession.username || selectedSession.user_id || 'Unknown'}</p>
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

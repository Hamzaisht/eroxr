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
  onMonitorSession: (session: LiveSession) => Promise<boolean>;
  onShowMediaPreview: (session: LiveSession) => void;
  onModerate: (session: LiveSession, action: ModerationAction, editedContent?: string) => Promise<void>;
  actionInProgress: string | null;
}

export const SessionList = ({ 
  onMonitorSession,
  onShowMediaPreview,
  onModerate,
  actionInProgress
}: SessionListProps) => {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<LiveSession | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState<SearchFilter>({ query: '' });
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  useEffect(() => {
    fetchSessions();
  }, [supabase, searchFilter]);

  const fetchSessions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('live_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchFilter.query) {
        query = query.ilike('title', `%${searchFilter.query}%`);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        setSessions(data || []);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (filters: SearchFilter) => {
    setSearchFilter(filters);
  };

  const handleRefresh = () => {
    fetchSessions();
    toast({
      title: "Sessions Refreshed!",
      description: "The session list has been updated.",
    });
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
                  <div className="font-medium">{session.title}</div>
                  <div className="text-sm text-muted-foreground">{session.description}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Tv className="h-4 w-4 text-muted-foreground" />
                    <span>{session.creator_id}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(session.created_at).toLocaleTimeString()}
                </TableCell>
                <TableCell className="text-right">
                  <SessionActions 
                    session={session}
                    onMonitorSession={onMonitorSession}
                    onShowMediaPreview={onShowMediaPreview}
                    onModerate={onModerate}
                    actionInProgress={actionInProgress}
                  />
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

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { MediaPreviewDialog } from "./components/MediaPreviewDialog";
import { LiveSession } from "@/types/surveillance";

interface SessionListProps {
  sessions: LiveSession[];
  isLoading: boolean;
  error: string | null;
  onMonitorSession?: (session: LiveSession) => Promise<boolean>;
  actionInProgress: string | null;
  onRefresh: () => void;
}

export function SessionList({ 
  sessions, 
  isLoading, 
  error, 
  onMonitorSession, 
  actionInProgress,
  onRefresh
}: SessionListProps) {
  const [selectedMediaSession, setSelectedMediaSession] = useState<LiveSession | null>(null);
  const [showMediaDialog, setShowMediaDialog] = useState(false);

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Unknown time";
    }
  };
  
  // Handle monitoring session
  const handleMonitor = async (session: LiveSession) => {
    if (onMonitorSession) {
      await onMonitorSession(session);
    }
  };
  
  // Open media preview dialog
  const handleOpenMediaPreview = (session: LiveSession) => {
    setSelectedMediaSession(session);
    setShowMediaDialog(true);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="ml-2">Loading sessions...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={onRefresh}>Try Again</Button>
      </div>
    );
  }
  
  if (!sessions || sessions.length === 0) {
    return (
      <div className="text-center p-8">
        <p>No active sessions found</p>
        <Button onClick={onRefresh} className="mt-4">Refresh</Button>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 gap-4">
      {sessions.map((session) => (
        <Card key={session.id} className="p-4 relative hover:bg-accent/5 transition-colors">
          <div className="flex items-center gap-4">
            {/* User Avatar */}
            <Avatar className="h-12 w-12 border border-border">
              <AvatarImage src={session.avatar_url} alt={session.username || "User"} />
              <AvatarFallback>{session.username?.[0] || "U"}</AvatarFallback>
            </Avatar>
            
            {/* Session Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{session.username || "Anonymous User"}</h3>
                <Badge variant={session.status === "active" ? "default" : "secondary"}>
                  {session.status}
                </Badge>
              </div>
              
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="line-clamp-1">
                  {session.title || session.content?.substring(0, 50) || `${session.type} session`}
                </p>
                <div className="flex items-center text-xs space-x-2">
                  <span className="inline-flex items-center">
                    {session.created_at && (
                      <span>Started {formatRelativeTime(session.created_at)}</span>
                    )}
                  </span>
                  {(session.viewers_count !== undefined || session.viewer_count !== undefined) && (
                    <span className="inline-flex items-center">
                      <span className="mx-1">•</span>
                      {session.viewers_count || session.viewer_count} viewers
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleOpenMediaPreview(session)}
              >
                Preview
              </Button>
              {onMonitorSession && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleMonitor(session)}
                  disabled={actionInProgress === session.id}
                >
                  {actionInProgress === session.id ? "Monitoring..." : "Monitor"}
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
      
      <MediaPreviewDialog 
        session={selectedMediaSession} 
        open={showMediaDialog}
        onOpenChange={setShowMediaDialog}
      />
    </div>
  );
}

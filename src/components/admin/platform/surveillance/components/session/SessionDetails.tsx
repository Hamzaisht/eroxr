
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LiveSession } from "@/types/surveillance";
import { formatDistanceToNow } from "date-fns";
import { SessionBadge } from "./SessionBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CameraIcon, MessagesSquare, PhoneCall, MapPin, Tag } from "lucide-react";

interface SessionDetailsProps {
  session: LiveSession | null;
  className?: string;
}

export const SessionDetails = ({ session, className }: SessionDetailsProps) => {
  if (!session) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>No Session Selected</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Select a session to view details
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Format the timestamp
  const formattedTime = session.started_at 
    ? formatDistanceToNow(new Date(session.started_at), { addSuffix: true })
    : "Unknown time";
  
  // Determine the session icon
  const getSessionIcon = () => {
    switch (session.type) {
      case 'stream':
        return <CameraIcon className="h-5 w-5 text-primary" />;
      case 'call':
        return <PhoneCall className="h-5 w-5 text-primary" />;
      case 'chat':
      case 'message':
        return <MessagesSquare className="h-5 w-5 text-primary" />;
      default:
        return null;
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center">
          <CardTitle className="text-lg font-medium">
            Session Details
          </CardTitle>
          <SessionBadge session={session} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Session Header */}
        <div className="flex items-start space-x-3">
          <Avatar className="h-10 w-10 border border-border">
            <AvatarImage src={session.avatar_url} alt={session.username || "User"} />
            <AvatarFallback>
              {session.username ? session.username.charAt(0).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="font-medium leading-none">{session.username || "Unknown User"}</h3>
            <p className="text-sm text-muted-foreground">
              {formattedTime} • {session.type}
            </p>
            {session.location && (
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <MapPin className="h-3 w-3 mr-1" /> {session.location}
              </div>
            )}
            {session.tags && session.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                <Tag className="h-3 w-3 text-muted-foreground" />
                {session.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="px-1 py-0 text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Session Details */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Session ID</span>
            <span className="font-mono text-xs truncate">{session.id}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">User ID</span>
            <span className="font-mono text-xs truncate">{session.user_id}</span>
          </div>
        </div>
        
        {/* Session Content */}
        {session.title && (
          <div className="pt-2">
            <h4 className="text-sm font-medium mb-1">Title</h4>
            <p className="text-sm">{session.title}</p>
          </div>
        )}
        
        {session.description && (
          <div className="pt-2">
            <h4 className="text-sm font-medium mb-1">Description</h4>
            <p className="text-sm">{session.description}</p>
          </div>
        )}
        
        {session.content && (
          <div className="pt-2">
            <h4 className="text-sm font-medium mb-1">Content</h4>
            <p className="text-sm">{session.content}</p>
          </div>
        )}
        
        {/* Recipient details for calls/chats */}
        {session.recipient_username && (
          <div className="pt-2">
            <h4 className="text-sm font-medium mb-1">Recipient</h4>
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={session.recipient_avatar} alt={session.recipient_username} />
                <AvatarFallback>
                  {session.recipient_username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{session.recipient_username}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

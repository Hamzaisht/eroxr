
import { Badge } from "@/components/ui/badge";
import { LiveSession } from "../../types";

interface SessionBadgeProps {
  session: LiveSession;
}

export const SessionBadge = ({ session }: SessionBadgeProps) => {
  // Determine badge color based on session type and status
  const getBadgeVariant = () => {
    if (session.is_paused) return "destructive";
    
    switch (session.type) {
      case 'stream':
        return "default";
      case 'call':
        return "secondary";
      case 'chat':
        return "outline";
      case 'bodycontact':
        return session.status === 'flagged' ? "destructive" : "secondary";
      case 'content':
        return "outline";
      default:
        return "secondary";
    }
  };
  
  // Get badge text
  const getBadgeText = () => {
    if (session.is_paused) return "PAUSED";
    
    switch (session.type) {
      case 'stream':
        return "LIVE";
      case 'call':
        return "ACTIVE";
      case 'chat':
        return session.message_type ? session.message_type.toUpperCase() : "MESSAGE";
      case 'bodycontact':
        return session.status ? session.status.toUpperCase() : "ACTIVE";
      case 'content':
        return session.content_type ? session.content_type.toUpperCase() : "CONTENT";
      default:
        return session.type ? session.type.toUpperCase() : "ACTIVE";
    }
  };
  
  return (
    <Badge variant={getBadgeVariant()}>
      {getBadgeText()}
    </Badge>
  );
};

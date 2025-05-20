
import { Badge } from "@/components/ui/badge";
import { LiveSession, SessionType, SessionStatus } from "@/types/surveillance";

interface SessionBadgeProps {
  session: LiveSession;
}

export const SessionBadge = ({ session }: SessionBadgeProps) => {
  // Determine badge color based on session type and status
  const getBadgeVariant = () => {
    if (session.is_paused) return "destructive";
    
    switch (session.type) {
      case SessionType.STREAM:
        return "default";
      case SessionType.CALL:
        return "secondary";
      case SessionType.CHAT:
        return "outline";
      case SessionType.BODYCONTACT:
        // Check for flagged status using string comparison instead of enum
        return session.status === "flagged" ? "destructive" : "secondary";
      case SessionType.CONTENT:
        return "outline";
      default:
        return "secondary";
    }
  };
  
  // Get badge text
  const getBadgeText = () => {
    if (session.is_paused) return "PAUSED";
    
    switch (session.type) {
      case SessionType.STREAM:
        return "LIVE";
      case SessionType.CALL:
        return "ACTIVE";
      case SessionType.CHAT:
        return session.message_type ? String(session.message_type).toUpperCase() : "MESSAGE";
      case SessionType.BODYCONTACT:
        return session.status ? String(session.status).toUpperCase() : "ACTIVE";
      case SessionType.CONTENT:
        return session.content_type ? String(session.content_type).toUpperCase() : "CONTENT";
      default:
        return session.type ? String(session.type).toUpperCase() : "ACTIVE";
    }
  };
  
  return (
    <Badge variant={getBadgeVariant()}>
      {getBadgeText()}
    </Badge>
  );
};

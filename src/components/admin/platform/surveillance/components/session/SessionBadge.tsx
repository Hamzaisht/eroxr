
import { Badge } from "@/components/ui/badge";
import { LiveSession, SessionStatus } from "@/types/surveillance";

interface SessionBadgeProps {
  session: LiveSession;
}

export const SessionBadge = ({ session }: SessionBadgeProps) => {
  // Determine badge variant based on session status
  const getBadgeVariant = () => {
    if (!session.status) return "secondary";
    
    if (session.status === SessionStatus.ACTIVE || session.status === "active" || 
        session.status === SessionStatus.LIVE || session.status === "live") {
      return "success";
    }
    
    if (session.status === SessionStatus.IDLE || session.status === "idle") {
      return "secondary";
    }
    
    if (session.status === SessionStatus.ENDED || session.status === "ended") {
      return "destructive";
    }
    
    if (session.status === SessionStatus.FLAGGED || session.status === "flagged") {
      return "destructive";
    }
    
    if (session.status === SessionStatus.PAUSED || session.status === "paused") {
      return "warning";
    }
    
    return "secondary";
  };
  
  return (
    <Badge variant={getBadgeVariant()} className="ml-2 px-2 py-0.5 text-xs">
      {session.status}
    </Badge>
  );
};


import { Badge } from "@/components/ui/badge";
import { LiveSession, SessionStatus } from "@/types/surveillance";

interface SessionBadgeProps {
  session: LiveSession;
}

export const SessionBadge = ({ session }: SessionBadgeProps) => {
  // Determine badge variant based on session status
  const getBadgeVariant = () => {
    if (!session.status) return "secondary";
    
    // Convert string status to enum if needed
    const status = typeof session.status === 'string' 
      ? session.status.toLowerCase() 
      : session.status;
    
    // Check for active or live status
    if (status === SessionStatus.ACTIVE || status === 'active' ||
        status === SessionStatus.LIVE || status === 'live') {
      return "default"; // Using default instead of success
    }
    
    // Check for idle status
    if (status === SessionStatus.IDLE || status === 'idle') {
      return "secondary";
    }
    
    // Check for ended status
    if (status === SessionStatus.ENDED || status === 'ended') {
      return "destructive";
    }
    
    // Check for flagged status
    if (status === SessionStatus.FLAGGED || status === 'flagged') {
      return "destructive";
    }
    
    // Check for paused status
    if (status === SessionStatus.PAUSED || status === 'paused') {
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

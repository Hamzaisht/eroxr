
import { Badge } from "@/components/ui/badge";
import { LiveSession } from "../../types";

interface SessionBadgeProps {
  session: LiveSession;
}

export const SessionBadge = ({ session }: SessionBadgeProps) => {
  if (session.type === 'stream') {
    return (
      <Badge 
        variant="outline" 
        className="font-normal text-xs bg-green-900/30 text-green-300 border-green-800"
      >
        Live
      </Badge>
    );
  }
  
  if (session.type === 'call') {
    return (
      <Badge 
        variant="outline" 
        className="font-normal text-xs bg-green-900/30 text-green-300 border-green-800"
      >
        In Call
      </Badge>
    );
  }
  
  if (session.type === 'chat') {
    return (
      <Badge 
        variant="outline" 
        className="font-normal text-xs bg-blue-900/30 text-blue-300 border-blue-800"
      >
        {session.content_type === 'snap' ? 'Snap' : 'Message'}
      </Badge>
    );
  }
  
  if (session.type === 'bodycontact') {
    return (
      <Badge 
        variant="outline" 
        className={session.status === 'active' 
          ? "font-normal text-xs bg-orange-900/30 text-orange-300 border-orange-800"
          : "font-normal text-xs bg-red-900/30 text-red-300 border-red-800"
        }
      >
        {session.status === 'active' ? 'Active Ad' : 'Flagged'}
      </Badge>
    );
  }
  
  return null;
};

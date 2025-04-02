
import { Clock, Users, User } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { LiveSession } from "../../types";
import { SessionBadge } from "./SessionBadge";

interface SessionDetailsProps {
  session: LiveSession;
}

export const SessionDetails = ({ session }: SessionDetailsProps) => {
  return (
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <h3 className="font-medium">{session.username || 'Unknown'}</h3>
        <SessionBadge session={session} />
      </div>
      
      {/* Title and description */}
      {session.title && (
        <p className="text-sm text-gray-400 truncate">
          {session.title}
        </p>
      )}
      
      {/* Session specific details */}
      {session.type === 'call' && (
        <div className="text-sm text-gray-400 mt-1">
          <div className="flex items-center space-x-2">
            <Users className="h-3 w-3" />
            <span>{session.participants || 2} participants</span>
          </div>
          {session.recipient_username && (
            <div className="flex items-center space-x-2 mt-1">
              <User className="h-3 w-3" />
              <span>With: {session.recipient_username || 'Unknown'}</span>
            </div>
          )}
        </div>
      )}
      
      {session.type === 'chat' && (
        <div className="text-sm text-gray-400 mt-1">
          <div className="flex items-center space-x-2">
            <User className="h-3 w-3" />
            <span>
              From: @{session.sender_username || session.username || 'Unknown'} 
              {' → '} 
              To: @{session.recipient_username || 'Unknown'}
            </span>
          </div>
          {session.content && (
            <p className="mt-1 text-xs opacity-70 truncate max-w-[300px]">{session.content}</p>
          )}
          {session.media_url && session.media_url.length > 0 && (
            <div className="mt-1 text-xs italic">
              {session.media_url.length} media attachment{session.media_url.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}
      
      {session.type === 'bodycontact' && session.location && (
        <div className="text-sm text-gray-400 mt-1">
          <div className="flex items-center space-x-2">
            <span>{session.location}</span>
          </div>
          {session.tags && session.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {session.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
                  {tag}
                </Badge>
              ))}
              {session.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs px-1 py-0">
                  +{session.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      )}
      
      {session.type === 'stream' && session.viewer_count !== undefined && (
        <div className="text-sm text-gray-400 mt-1">
          <div className="flex items-center space-x-2">
            <Users className="h-3 w-3" />
            <span>{session.viewer_count} viewers</span>
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
        <Clock className="h-3 w-3" />
        <span>
          {session.type === 'bodycontact' 
            ? `Active since ${format(new Date(session.started_at || session.created_at || new Date()), 'HH:mm:ss')}`
            : `Started ${format(new Date(session.started_at || session.created_at || new Date()), 'HH:mm:ss')}`
          }
        </span>
      </div>
    </div>
  );
}

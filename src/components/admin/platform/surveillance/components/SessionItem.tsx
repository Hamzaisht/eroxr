
import { format } from "date-fns";
import { Clock, ExternalLink, Ghost, Users, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LiveSession, ModerationAction } from "../types";
import { ModerationActions } from "./ModerationActions";

interface SessionItemProps {
  session: LiveSession;
  onMonitorSession: (session: LiveSession) => Promise<boolean>;
  onShowMediaPreview: (session: LiveSession) => void;
  onModerate: (session: LiveSession, action: ModerationAction, editedContent?: string) => void;
  actionInProgress: string | null;
}

export const SessionItem = ({ 
  session, 
  onMonitorSession, 
  onShowMediaPreview,
  onModerate,
  actionInProgress
}: SessionItemProps) => {
  // Helper function to get first character for avatar fallback
  const getInitial = (name: string | undefined) => {
    return (name || 'Unknown')?.[0]?.toUpperCase() || '?';
  };

  // Ensure media_url is always an array for compatibility
  const sessionWithValidMediaUrl = {
    ...session,
    media_url: Array.isArray(session.media_url) ? session.media_url : 
                session.media_url ? [session.media_url] : []
  };

  return (
    <div 
      key={session.id} 
      className="flex flex-col p-3 rounded-lg bg-[#161B22] hover:bg-[#1C222B] transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 border border-white/10">
            <AvatarImage src={session.avatar_url || undefined} alt={session.username || 'Unknown'} />
            <AvatarFallback>{getInitial(session.username)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{session.username || 'Unknown'}</h3>
              {session.type === 'stream' && (
                <Badge 
                  variant="outline" 
                  className="font-normal text-xs bg-green-900/30 text-green-300 border-green-800"
                >
                  Live
                </Badge>
              )}
              
              {session.type === 'call' && (
                <Badge 
                  variant="outline" 
                  className="font-normal text-xs bg-green-900/30 text-green-300 border-green-800"
                >
                  In Call
                </Badge>
              )}
              
              {session.type === 'chat' && (
                <Badge 
                  variant="outline" 
                  className="font-normal text-xs bg-blue-900/30 text-blue-300 border-blue-800"
                >
                  {session.content_type === 'snap' ? 'Snap' : 'Message'}
                </Badge>
              )}
              
              {session.type === 'bodycontact' && (
                <Badge 
                  variant="outline" 
                  className={session.status === 'active' 
                    ? "font-normal text-xs bg-orange-900/30 text-orange-300 border-orange-800"
                    : "font-normal text-xs bg-red-900/30 text-red-300 border-red-800"
                  }
                >
                  {session.status === 'active' ? 'Active Ad' : 'Flagged'}
                </Badge>
              )}
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
                  <p className="mt-1 text-xs opacity-70 truncate">{session.content}</p>
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
        </div>
        
        <div className="flex gap-2 items-start">
          {/* Preview content button */}
          <Button 
            size="sm" 
            variant="ghost"
            className="bg-blue-900/20 hover:bg-blue-800/30 text-blue-300"
            onClick={() => onShowMediaPreview(sessionWithValidMediaUrl)}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Preview
          </Button>
          
          {/* Monitor button */}
          <Button 
            size="sm" 
            variant="ghost" 
            className="bg-purple-900/20 hover:bg-purple-800/30 text-purple-300 border-purple-800/50"
            onClick={() => onMonitorSession(sessionWithValidMediaUrl)}
          >
            <Ghost className="h-4 w-4 mr-2" />
            Monitor
          </Button>
          
          {/* Moderation actions dropdown */}
          <ModerationActions 
            session={sessionWithValidMediaUrl} 
            onModerate={onModerate} 
            actionInProgress={actionInProgress} 
          />
        </div>
      </div>
    </div>
  );
};

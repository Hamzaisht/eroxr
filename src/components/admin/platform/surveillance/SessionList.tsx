
import { format } from "date-fns";
import { Clock } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LiveSession } from "../user-analytics/types";
import { Ghost } from "lucide-react";

interface SessionListProps {
  sessions: LiveSession[];
  isLoading: boolean;
  onMonitorSession: (session: LiveSession) => Promise<void>;
}

export const SessionList = ({ sessions, isLoading, onMonitorSession }: SessionListProps) => {  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="h-8 w-8 animate-spin text-purple-400 border-2 border-current border-t-transparent rounded-full" />
      </div>
    );
  }
  
  if (sessions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <div className="h-10 w-10 mx-auto mb-2 opacity-50" />
        <p>No active sessions at the moment</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {sessions.map((sessionItem) => (
        <div 
          key={sessionItem.id} 
          className="flex items-start gap-3 p-3 rounded-lg bg-[#161B22] hover:bg-[#1C222B] transition-colors"
        >
          <Avatar>
            <AvatarImage src={sessionItem.avatar_url || undefined} />
            <AvatarFallback>{sessionItem.username?.[0]?.toUpperCase() || '?'}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{sessionItem.username}</h3>
              {sessionItem.type === 'stream' && (
                <Badge 
                  variant="outline" 
                  className="font-normal text-xs bg-green-900/30 text-green-300 border-green-800"
                >
                  Live
                </Badge>
              )}
              
              {sessionItem.type === 'call' && (
                <Badge 
                  variant="outline" 
                  className="font-normal text-xs bg-green-900/30 text-green-300 border-green-800"
                >
                  In Call
                </Badge>
              )}
              
              {sessionItem.type === 'chat' && (
                <Badge 
                  variant="outline" 
                  className="font-normal text-xs bg-blue-900/30 text-blue-300 border-blue-800"
                >
                  {sessionItem.content_type === 'snap' ? 'Snap' : 'Message'}
                </Badge>
              )}
              
              {sessionItem.type === 'bodycontact' && (
                <Badge 
                  variant="outline" 
                  className={sessionItem.status === 'active' 
                    ? "font-normal text-xs bg-orange-900/30 text-orange-300 border-orange-800"
                    : "font-normal text-xs bg-red-900/30 text-red-300 border-red-800"
                  }
                >
                  {sessionItem.status === 'active' ? 'Pending' : 'Flagged'}
                </Badge>
              )}
            </div>
            
            {sessionItem.title && (
              <p className="text-sm text-gray-400 truncate">
                {sessionItem.title}
              </p>
            )}
            
            {sessionItem.type === 'call' && (
              <p className="text-sm text-gray-400">
                {sessionItem.participants || 2} participants • {sessionItem.content_type === 'video' ? 'Video' : 'Voice'} call
              </p>
            )}
            
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>
                {sessionItem.type === 'bodycontact' 
                  ? `Created ${format(new Date(sessionItem.created_at), 'HH:mm:ss')}`
                  : `Started ${format(new Date(sessionItem.started_at), 'HH:mm:ss')}`
                }
              </span>
            </div>
          </div>
          
          <Button 
            size="sm" 
            variant="ghost" 
            className="bg-purple-900/20 hover:bg-purple-800/30 text-purple-300 border-purple-800/50"
            onClick={() => onMonitorSession(sessionItem)}
          >
            <Ghost className="h-4 w-4 mr-2" />
            Monitor
          </Button>
        </div>
      ))}
    </div>
  );
};

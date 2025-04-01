
import { format } from "date-fns";
import { Clock, Ban, Flag, MessageSquare, ExternalLink, MoreHorizontal, User, Users } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LiveSession } from "../user-analytics/types";
import { Ghost } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

interface SessionListProps {
  sessions: LiveSession[];
  isLoading: boolean;
  onMonitorSession: (session: LiveSession) => Promise<boolean>;
}

export const SessionList = ({ sessions, isLoading, onMonitorSession }: SessionListProps) => {  
  const { toast } = useToast();
  const userSession = useSession();
  const [showMediaPreview, setShowMediaPreview] = useState<LiveSession | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const handleModeration = async (session: LiveSession, action: string) => {
    if (!userSession?.user?.id) return;
    
    setActionInProgress(session.id);
    try {
      // Log the moderation action in admin audit logs
      await supabase.from('admin_audit_logs').insert({
        user_id: userSession.user.id,
        action: `ghost_${action}`,
        details: {
          timestamp: new Date().toISOString(),
          session_id: session.id,
          session_type: session.type,
          target_user_id: session.user_id,
          target_username: session.username
        }
      });

      // For more serious actions like ban, we'll need additional API calls
      if (action === 'ban') {
        await supabase.from('profiles').update({
          is_suspended: true,
          suspended_at: new Date().toISOString()
        }).eq('id', session.user_id);
      }

      toast({
        title: "Action Completed",
        description: `Successfully performed ${action} on ${session.username || 'Unknown'}`,
      });
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
      toast({
        title: "Action Failed",
        description: `Could not perform ${action}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setActionInProgress(null);
    }
  };

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
          className="flex flex-col p-3 rounded-lg bg-[#161B22] hover:bg-[#1C222B] transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10 border border-white/10">
                <AvatarImage src={sessionItem.avatar_url || undefined} alt={sessionItem.username || 'Unknown'} />
                <AvatarFallback>{(sessionItem.username || 'Unknown')?.[0]?.toUpperCase() || '?'}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{sessionItem.username || 'Unknown'}</h3>
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
                      {sessionItem.status === 'active' ? 'Active Ad' : 'Flagged'}
                    </Badge>
                  )}
                </div>
                
                {/* Title and description */}
                {sessionItem.title && (
                  <p className="text-sm text-gray-400 truncate">
                    {sessionItem.title}
                  </p>
                )}
                
                {/* Session specific details */}
                {sessionItem.type === 'call' && (
                  <div className="text-sm text-gray-400 mt-1">
                    <div className="flex items-center space-x-2">
                      <Users className="h-3 w-3" />
                      <span>{sessionItem.participants || 2} participants</span>
                    </div>
                    {sessionItem.recipient_username && (
                      <div className="flex items-center space-x-2 mt-1">
                        <User className="h-3 w-3" />
                        <span>With: {sessionItem.recipient_username}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {sessionItem.type === 'chat' && sessionItem.recipient_username && (
                  <div className="text-sm text-gray-400 mt-1">
                    <div className="flex items-center space-x-2">
                      <User className="h-3 w-3" />
                      <span>To: {sessionItem.recipient_username}</span>
                    </div>
                  </div>
                )}
                
                {sessionItem.type === 'bodycontact' && sessionItem.location && (
                  <div className="text-sm text-gray-400 mt-1">
                    <div className="flex items-center space-x-2">
                      <span>{sessionItem.location}</span>
                    </div>
                    {sessionItem.tags && sessionItem.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {sessionItem.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
                            {tag}
                          </Badge>
                        ))}
                        {sessionItem.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs px-1 py-0">
                            +{sessionItem.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                )}
                
                {sessionItem.type === 'stream' && sessionItem.viewer_count !== undefined && (
                  <div className="text-sm text-gray-400 mt-1">
                    <div className="flex items-center space-x-2">
                      <Users className="h-3 w-3" />
                      <span>{sessionItem.viewer_count} viewers</span>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>
                    {sessionItem.type === 'bodycontact' 
                      ? `Active since ${format(new Date(sessionItem.started_at), 'HH:mm:ss')}`
                      : `Started ${format(new Date(sessionItem.started_at), 'HH:mm:ss')}`
                    }
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 items-start">
              {/* Preview content button */}
              <Dialog open={showMediaPreview?.id === sessionItem.id} onOpenChange={(open) => !open && setShowMediaPreview(null)}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="bg-blue-900/20 hover:bg-blue-800/30 text-blue-300"
                    onClick={() => setShowMediaPreview(sessionItem)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Content Preview - {sessionItem.type}</DialogTitle>
                    <DialogDescription>
                      {sessionItem.username}'s {sessionItem.type} content
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="mt-4 space-y-4">
                    {sessionItem.type === 'stream' && (
                      <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center">
                        <p className="text-gray-400">Stream preview would appear here</p>
                        {/* In a real implementation, you would embed the stream here */}
                      </div>
                    )}
                    
                    {sessionItem.type === 'chat' && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Message Content:</h3>
                        <div className="p-3 bg-gray-900 rounded-lg">
                          {sessionItem.content ? (
                            <p className="text-gray-300">{sessionItem.content}</p>
                          ) : (
                            <p className="text-gray-500 italic">No text content</p>
                          )}
                        </div>
                        
                        {sessionItem.media_url && sessionItem.media_url.length > 0 && (
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">Media:</h3>
                            <div className="grid grid-cols-2 gap-2">
                              {sessionItem.media_url.map((url, index) => (
                                <img 
                                  key={index}
                                  src={url} 
                                  alt={`Media ${index}`} 
                                  className="w-full h-32 object-cover rounded-md"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {sessionItem.video_url && (
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">Video:</h3>
                            <div className="aspect-video bg-black rounded-lg">
                              <video 
                                src={sessionItem.video_url} 
                                controls
                                className="w-full h-full"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {sessionItem.type === 'bodycontact' && (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium">About:</h3>
                          <p className="text-gray-300 mt-1">{sessionItem.about_me || sessionItem.description || 'No description provided'}</p>
                        </div>
                        
                        {sessionItem.tags && sessionItem.tags.length > 0 && (
                          <div>
                            <h3 className="text-sm font-medium">Tags:</h3>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {sessionItem.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <h3 className="text-sm font-medium">Location:</h3>
                          <p className="text-gray-300 mt-1">{sessionItem.location || 'Unknown location'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              
              {/* Monitor button */}
              <Button 
                size="sm" 
                variant="ghost" 
                className="bg-purple-900/20 hover:bg-purple-800/30 text-purple-300 border-purple-800/50"
                onClick={() => onMonitorSession(sessionItem)}
              >
                <Ghost className="h-4 w-4 mr-2" />
                Monitor
              </Button>
              
              {/* Moderation actions dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    size="sm"
                    variant="ghost"
                    className="bg-red-900/20 hover:bg-red-800/30 text-red-300"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Moderation Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-yellow-400 flex items-center space-x-2"
                    onClick={() => handleModeration(sessionItem, 'flag')}
                    disabled={!!actionInProgress}
                  >
                    <Flag className="h-4 w-4" />
                    <span>Flag Content</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-orange-400 flex items-center space-x-2"
                    onClick={() => handleModeration(sessionItem, 'warn')}
                    disabled={!!actionInProgress}
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Send Warning</span>
                  </DropdownMenuItem>
                  <Dialog>
                    <DialogTrigger asChild>
                      <DropdownMenuItem
                        className="text-red-400 flex items-center space-x-2"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <Ban className="h-4 w-4" />
                        <span>Ban User</span>
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Ban User</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to ban {sessionItem.username || 'this user'}? This action will remove all their content and block their account.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="mt-4">
                        <Button 
                          variant="destructive" 
                          onClick={() => handleModeration(sessionItem, 'ban')}
                          disabled={!!actionInProgress}
                        >
                          {actionInProgress === sessionItem.id ? 'Processing...' : 'Confirm Ban'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

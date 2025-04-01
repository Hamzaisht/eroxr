
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EyeOff, ExternalLink, Ban, Flag, MessageSquare } from "lucide-react";
import { LiveSession } from "../user-analytics/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface ActiveSurveillanceCardProps {
  session: LiveSession;
  onEndSurveillance: () => Promise<boolean>;
}

export const ActiveSurveillanceCard = ({ 
  session, 
  onEndSurveillance 
}: ActiveSurveillanceCardProps) => {
  const userSession = useSession();
  const { toast } = useToast();
  const [actionInProgress, setActionInProgress] = useState(false);
  
  const handleEndSurveillance = async () => {
    await onEndSurveillance();
  };
  
  const handleModeration = async (action: string) => {
    if (!userSession?.user?.id) return;
    
    setActionInProgress(true);
    try {
      // Log the moderation action
      await supabase.from('admin_audit_logs').insert({
        user_id: userSession.user.id,
        action: `ghost_surveillance_${action}`,
        details: {
          timestamp: new Date().toISOString(),
          session_id: session.id,
          session_type: session.type,
          target_user_id: session.user_id,
          target_username: session.username || 'Unknown'
        }
      });
      
      // For ban action, we'd update the user profile
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
      
      // End surveillance after taking action
      if (['ban', 'flag'].includes(action)) {
        await onEndSurveillance();
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
      toast({
        title: "Action Failed",
        description: `Could not perform ${action}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setActionInProgress(false);
    }
  };
  
  return (
    <Card className="bg-purple-950/30 border-purple-700/50 mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="relative flex h-3 w-3 mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          Active Surveillance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-white/10">
                <AvatarImage src={session.avatar_url || undefined} alt={session.username || 'Unknown'} />
                <AvatarFallback>{(session.username || 'Unknown').charAt(0).toUpperCase() || '?'}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{session.username || 'Unknown'}</div>
                <div className="text-sm text-gray-400">
                  {session.type.charAt(0).toUpperCase() + session.type.slice(1)}: {session.title || "Unnamed"}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Started: {format(new Date(session.started_at), 'HH:mm:ss')}
                </div>
                
                {/* Show additional info based on session type */}
                {session.type === 'chat' && session.recipient_username && (
                  <div className="flex items-center mt-1">
                    <span className="text-xs">With: </span>
                    <Badge variant="outline" className="text-xs ml-1 py-0">
                      {session.recipient_username}
                    </Badge>
                  </div>
                )}
                
                {session.type === 'bodycontact' && session.location && (
                  <div className="text-xs text-gray-500 mt-1">
                    Location: {session.location}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-gray-400 border-gray-700"
                onClick={handleEndSurveillance}
                disabled={actionInProgress}
              >
                <EyeOff className="h-4 w-4 mr-2" />
                End
              </Button>
              
              {session.type === 'stream' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-gray-400 border-gray-700"
                  onClick={() => window.open(`/livestream/${session.id}`, '_blank')}
                  disabled={actionInProgress}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open
                </Button>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-400 border-red-900/50"
                    disabled={actionInProgress}
                  >
                    Moderate
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-yellow-400 flex items-center"
                    onClick={() => handleModeration('flag')}
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Flag Content
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-orange-400 flex items-center"
                    onClick={() => handleModeration('warn')}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Warning
                  </DropdownMenuItem>
                  <Dialog>
                    <DialogTrigger asChild>
                      <DropdownMenuItem
                        className="text-red-400 flex items-center"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <Ban className="h-4 w-4 mr-2" />
                        Ban User
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Ban User</DialogTitle>
                      </DialogHeader>
                      <p className="py-4">
                        Are you sure you want to ban {session.username || 'this user'}? This action cannot be undone.
                      </p>
                      <DialogFooter>
                        <Button 
                          variant="destructive" 
                          onClick={() => handleModeration('ban')}
                          disabled={actionInProgress}
                        >
                          {actionInProgress ? 'Processing...' : 'Confirm Ban'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

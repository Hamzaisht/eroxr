
import React from 'react';
import { LiveSession } from '../surveillance/types';
import { Ban, User, Shield, Eye, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SurveillanceIndicatorProps {
  isVisible: boolean;
  session?: LiveSession;
}

export const SurveillanceIndicator: React.FC<SurveillanceIndicatorProps> = ({
  isVisible,
  session
}) => {
  const userSession = useSession();
  const { toast } = useToast();
  
  if (!isVisible || !session) return null;

  const handleEndSurveillance = async () => {
    try {
      if (userSession?.user?.id) {
        await supabase.from('admin_audit_logs').insert({
          user_id: userSession.user.id,
          action: 'ghost_surveillance_ended',
          details: {
            timestamp: new Date().toISOString(),
            session_id: session.id,
            session_type: session.type,
            target_user_id: session.user_id,
            target_username: session.username || 'Unknown'
          }
        });
      }
      
      window.close(); // Close the monitoring window
      
      // Note: In a real implementation, you'd also want to call the stopSurveillance function
      // from the parent component, but for this indicator it would auto-close the window
    } catch (error) {
      console.error("Error ending surveillance:", error);
      toast({
        title: "Error",
        description: "Could not end surveillance session",
        variant: "destructive"
      });
    }
  };
  
  // Get session type-specific details
  const getSessionTypeIcon = () => {
    switch (session.type) {
      case 'stream':
        return <Eye className="h-3 w-3 mr-1 text-green-400" />;
      case 'call':
        return <User className="h-3 w-3 mr-1 text-blue-400" />;
      case 'chat':
        return <User className="h-3 w-3 mr-1 text-purple-400" />;
      case 'bodycontact':
        return <Shield className="h-3 w-3 mr-1 text-yellow-400" />;
      default:
        return <Eye className="h-3 w-3 mr-1" />;
    }
  };

  return (
    <div className="fixed bottom-0 right-0 z-50 p-3 bg-red-900/90 text-white text-xs rounded-tl-lg flex items-center space-x-2 border-t border-l border-red-700 shadow-xl">
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
      </div>
      <div className="flex flex-col">
        <div className="font-bold flex items-center">
          <User className="h-3 w-3 mr-1" />
          Monitoring: {session.username || 'Unknown'}
        </div>
        <div className="text-xs text-red-200 flex items-center">
          {getSessionTypeIcon()}
          {session.type.charAt(0).toUpperCase() + session.type.slice(1)}
          {session.title ? `: ${session.title.substring(0, 15)}${session.title.length > 15 ? '...' : ''}` : ''}
        </div>
        <div className="text-xs text-red-200 flex items-center mt-1">
          <Clock className="h-3 w-3 mr-1" />
          Started: {session.started_at ? format(new Date(session.started_at), 'HH:mm:ss') : 'Unknown'}
        </div>
      </div>
      <button 
        className="bg-red-800 hover:bg-red-700 p-1 rounded"
        aria-label="End surveillance"
        onClick={handleEndSurveillance}
      >
        <Ban className="h-3 w-3" />
      </button>
    </div>
  );
};

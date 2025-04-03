
import { Ban, Flag, MessageSquare, Trash2, Eye, Edit, Shield, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiveSession, ModerationAction, SurveillanceContentItem } from "../../types";

interface ModerationActionButtonProps {
  session: LiveSession | SurveillanceContentItem;
  onAction: (action: ModerationAction) => void;
  actionInProgress: string | null;
}

export function ModerationActionButton({
  session,
  onAction,
  actionInProgress
}: ModerationActionButtonProps) {
  // Helper to check if user is paused
  const isUserPaused = (): boolean => {
    if ('is_paused' in session) {
      return !!session.is_paused;
    }
    return false;
  };

  // Determine the default/primary action based on content type or status
  const getPrimaryAction = (): { action: ModerationAction; icon: JSX.Element; label: string } => {
    // If the user is paused, primary action should be unpause
    if (isUserPaused()) {
      return {
        action: 'unpause',
        icon: <Play className="h-4 w-4 mr-2" />,
        label: 'Unpause'
      };
    }
    
    // If the content is a chat message, primary action is probably "view"
    if (session.type === 'chat' || session.type === 'message') {
      return {
        action: 'view',
        icon: <Eye className="h-4 w-4 mr-2" />,
        label: 'View'
      };
    }
    
    // If it's a user or profile type content, primary action is probably "ban"
    if (session.type === 'user' || session.type === 'profile') {
      return {
        action: 'ban',
        icon: <Ban className="h-4 w-4 mr-2" />,
        label: 'Ban User'
      };
    }
    
    // If it's suspicious content, suggest shadowban as the primary action
    if (session.status === 'suspicious' || session.status === 'reported') {
      return {
        action: 'shadowban',
        icon: <Shield className="h-4 w-4 mr-2" />,
        label: 'Shadowban'
      };
    }
    
    // If it's inactive or problematic content, suggest pause as primary action
    if (session.status === 'inactive' || session.status === 'problematic') {
      return {
        action: 'pause',
        icon: <Pause className="h-4 w-4 mr-2" />,
        label: 'Pause Account'
      };
    }
    
    // For most content, flagging is a good default action
    return {
      action: 'flag',
      icon: <Flag className="h-4 w-4 mr-2" />,
      label: 'Flag'
    };
  };
  
  const primaryAction = getPrimaryAction();
  
  return (
    <Button
      variant="outline"
      size="sm"
      className={`${
        primaryAction.action === 'unpause' 
          ? 'text-green-500 border-green-500/30 bg-green-900/10 hover:bg-green-800/20' 
          : 'text-amber-500 border-amber-500/30 bg-amber-900/10 hover:bg-amber-800/20'
      }`}
      onClick={() => onAction(primaryAction.action)}
      disabled={!!actionInProgress}
    >
      {primaryAction.icon}
      {primaryAction.label}
    </Button>
  );
}

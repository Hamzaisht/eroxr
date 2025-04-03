
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Ban, Eye, Flag, ShieldAlert } from "lucide-react";
import { LiveSession, ModerationAction, SessionModerationActionProps } from "../../types";

interface ModerationButtonProps {
  session: LiveSession;
  onAction: (action: ModerationAction) => void;
  actionInProgress: string | null;
}

export function ModerationActionButton({ 
  session, 
  onAction, 
  actionInProgress
}: ModerationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Determine the most appropriate action based on session type
  const getPrimaryAction = (): { action: ModerationAction; icon: JSX.Element; variant: string; label: string } => {
    // Text-based content like messages prioritize view/edit
    if (session.type === "chat" || session.content_type === "message") {
      return {
        action: "view",
        icon: <Eye className="h-3.5 w-3.5 mr-1" />,
        variant: "outline",
        label: "View"
      };
    }
    
    // User profiles prioritize ban
    if (session.content_type === "user" || session.content_type === "profile") {
      return {
        action: "ban",
        icon: <Ban className="h-3.5 w-3.5 mr-1" />,
        variant: "destructive",
        label: "Ban User"
      };
    }
    
    // Default to flag for most content
    return {
      action: "flag",
      icon: <Flag className="h-3.5 w-3.5 mr-1" />,
      variant: "warning",
      label: "Flag" 
    };
  };
  
  const primaryAction = getPrimaryAction();
  
  return (
    <Button
      size="sm"
      variant={primaryAction.variant as any}
      className="h-7 text-xs"
      onClick={() => onAction(primaryAction.action)}
      disabled={!!actionInProgress || isLoading}
    >
      {primaryAction.icon}
      {primaryAction.label}
    </Button>
  );
}


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Ban, Eye, Flag, ShieldAlert } from "lucide-react";
import { LiveSession, SurveillanceContentItem, ModerationAction } from "@/types/surveillance";

interface ModerationButtonProps {
  session: LiveSession | SurveillanceContentItem;
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
  const getPrimaryAction = (): { action: ModerationAction; icon: JSX.Element; variant: "outline" | "destructive" | "default" | "link" | "ghost" | "secondary"; label: string } => {
    const contentType = (session as any).content_type || '';
    
    // For LiveSession objects that have a type property
    if ('type' in session && session.type === "chat" || contentType === "message") {
      return {
        action: "view",
        icon: <Eye className="h-3.5 w-3.5 mr-1" />,
        variant: "outline",
        label: "View"
      };
    }
    
    // User profiles prioritize ban
    if (contentType === "user" || contentType === "profile") {
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
      variant: "ghost",
      label: "Flag" 
    };
  };
  
  const primaryAction = getPrimaryAction();
  
  return (
    <Button
      size="sm"
      variant={primaryAction.variant}
      className="h-7 text-xs"
      onClick={() => onAction(primaryAction.action)}
      disabled={!!actionInProgress || isLoading}
    >
      {primaryAction.icon}
      {primaryAction.label}
    </Button>
  );
}

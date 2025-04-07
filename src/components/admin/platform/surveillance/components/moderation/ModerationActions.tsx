
import { useState } from "react";
import { MoreHorizontal, Flag, Ban, EyeOff, Trash2, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  LiveSession, 
  SurveillanceContentItem, 
  ModerationAction,
  LiveSessionType
} from "@/types/surveillance";
import { ModerationActionDialog } from "./ModerationActionDialog";
import { ModerationActionItems } from "./ModerationActionItems";
import { ModerationActionButton } from "./ModerationActionButton";
import { useModerationActions } from "@/hooks/useModerationActions";

interface ModerationActionsProps {
  session: LiveSession | SurveillanceContentItem;
  onModerate: (session: LiveSession | SurveillanceContentItem, action: ModerationAction, editedContent?: string) => Promise<void>;
  actionInProgress: string | null;
}

export function ModerationActions({
  session,
  onModerate,
  actionInProgress
}: ModerationActionsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<ModerationAction | null>(null);
  const [editedContent, setEditedContent] = useState("");
  
  const handleAction = (action: ModerationAction) => {
    if (action === "edit") {
      setEditedContent((session as any).content || "");
      setCurrentAction(action);
      setIsDialogOpen(true);
    } else if (action === "ban" || action === "force_delete") {
      setCurrentAction(action);
      setIsDialogOpen(true);
    } else {
      onModerate(session, action);
    }
  };
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setCurrentAction(null);
  };
  
  const handleDialogAction = () => {
    if (currentAction === "edit") {
      onModerate(session, currentAction, editedContent);
    } else if (currentAction) {
      onModerate(session, currentAction);
    }
    setIsDialogOpen(false);
    setCurrentAction(null);
  };

  return (
    <div className="flex items-center space-x-2">
      <ModerationActionButton 
        session={session}
        onAction={handleAction}
        actionInProgress={actionInProgress}
      />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            disabled={!!actionInProgress}
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <ModerationActionItems 
            session={session}
            onAction={handleAction}
            actionInProgress={actionInProgress}
          />
        </DropdownMenuContent>
      </DropdownMenu>
      
      <ModerationActionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={handleDialogAction}
        currentAction={currentAction}
        session={session}
        editedContent={editedContent}
        setEditedContent={setEditedContent}
        actionInProgress={actionInProgress}
      />
    </div>
  );
}

export const SessionModerationActions: React.FC<{ session: LiveSession | SurveillanceContentItem }> = ({ session }) => {
  const { handleModeration, actionInProgress } = useModerationActions();
  
  const getCompatibleSession = (): LiveSession => {
    if ('type' in session && typeof session.type === 'string') {
      return session as LiveSession;
    } else {
      const contentItem = session as SurveillanceContentItem;
      
      return {
        id: contentItem.id,
        type: 'content' as LiveSessionType,
        user_id: contentItem.user_id || '',
        creator_id: contentItem.creator_id || contentItem.user_id || '',
        created_at: contentItem.created_at,
        content: contentItem.content,
        media_url: contentItem.media_url || [],
        username: contentItem.creator_username || contentItem.username || 'Unknown',
        avatar_url: contentItem.creator_avatar_url || contentItem.avatar_url,
        content_type: contentItem.content_type,
        title: contentItem.title || '',
        description: contentItem.description || '',
        status: contentItem.visibility || contentItem.status
      };
    }
  };
  
  const compatibleSession = getCompatibleSession();
  
  return (
    <ModerationActions 
      session={compatibleSession} 
      onModerate={handleModeration} 
      actionInProgress={actionInProgress} 
    />
  );
};

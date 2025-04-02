
import { useState } from "react";
import { SessionModerationActionProps, ModerationAction } from "../../types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { ModerationActionButton } from "./ModerationActionButton";
import { ModerationActionItems } from "./ModerationActionItems";
import { ModerationActionDialog } from "./ModerationActionDialog";

export const ModerationActions = ({ 
  session, 
  onModerate, 
  actionInProgress 
}: SessionModerationActionProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<ModerationAction | null>(null);
  const [editedContent, setEditedContent] = useState("");

  const handleActionClick = (action: ModerationAction) => {
    if (action === 'edit') {
      setEditedContent(session.content || '');
      setCurrentAction('edit');
      setDialogOpen(true);
    } else if (action === 'ban' || action === 'force_delete') {
      setCurrentAction(action);
      setDialogOpen(true);
    } else {
      onModerate(session, action);
    }
  };

  const handleConfirmAction = () => {
    if (currentAction === 'edit') {
      onModerate(session, 'edit', editedContent);
    } else if (currentAction) {
      onModerate(session, currentAction);
    }
    setDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ModerationActionButton />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Moderation Actions</DropdownMenuLabel>
          <ModerationActionItems 
            onActionClick={handleActionClick} 
            actionInProgress={actionInProgress}
            session={session}
          />
        </DropdownMenuContent>
      </DropdownMenu>

      <ModerationActionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleConfirmAction}
        currentAction={currentAction}
        session={session}
        editedContent={editedContent}
        setEditedContent={setEditedContent}
        actionInProgress={actionInProgress}
      />
    </>
  );
};

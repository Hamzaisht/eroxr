
import { useState } from "react";
import { LiveSession, ModerationAction, SurveillanceContentItem } from "../../../types";

interface UseModerationActionsProps {
  session: LiveSession | SurveillanceContentItem;
  onModerate: (session: LiveSession | SurveillanceContentItem, action: ModerationAction, editedContent?: string) => void;
}

export function useModerationActions({ session, onModerate }: UseModerationActionsProps) {
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

  return {
    isDialogOpen,
    setIsDialogOpen,
    currentAction,
    editedContent,
    setEditedContent,
    handleAction,
    handleDialogClose,
    handleDialogAction
  };
}


import { MoreHorizontal, TriangleAlert, Eye, Trash2, AlertCircle, Edit, Ban, Ghost, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { LiveSession, ModerationAction, SessionModerationActionProps, SurveillanceContentItem } from "../../types";
import { ModerationActionDialog } from "./ModerationActionDialog";
import { useState } from "react";
import { ModerationActionItems } from "./ModerationActionItems";

export function ModerationActions({
  session,
  onModerate,
  actionInProgress
}: SessionModerationActionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<ModerationAction | null>(null);
  const [content, setContent] = useState("");
  
  const handleAction = (action: ModerationAction) => {
    if (action === "edit") {
      setContent((session as any).content || "");
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
      onModerate(session, currentAction, content);
    }
    setIsDialogOpen(false);
    setCurrentAction(null);
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        disabled={!!actionInProgress}
        onClick={() => handleAction("view")}
      >
        <Eye className="h-3.5 w-3.5" />
      </Button>
      
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
          />
        </DropdownMenuContent>
      </DropdownMenu>
      
      <ModerationActionDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDialogAction}
        action={currentAction}
        content={content}
        setContent={setContent}
      />
    </div>
  );
}

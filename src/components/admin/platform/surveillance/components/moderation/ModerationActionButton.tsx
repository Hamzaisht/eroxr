
import { Eye } from "lucide-react";
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
  return (
    <Button
      variant="outline"
      size="icon"
      className="h-7 w-7"
      disabled={!!actionInProgress}
      onClick={() => onAction("view")}
    >
      <Eye className="h-3.5 w-3.5" />
    </Button>
  );
}

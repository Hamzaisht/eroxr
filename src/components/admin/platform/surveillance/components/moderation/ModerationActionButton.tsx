
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ModerationActionButtonProps {
  className?: string;
}

export const ModerationActionButton = ({ className }: ModerationActionButtonProps) => {
  return (
    <Button 
      size="sm"
      variant="ghost"
      className={className || "bg-red-900/20 hover:bg-red-800/30 text-red-300"}
    >
      <span className="sr-only">Moderation menu</span>
      <MoreVertical className="h-4 w-4" />
    </Button>
  );
};

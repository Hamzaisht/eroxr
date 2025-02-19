
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MessageActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  hasContent: boolean;
}

export const MessageActions = ({ onEdit, onDelete, hasContent }: MessageActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-luxury-darker/95 backdrop-blur-md border-luxury-primary/20">
        {hasContent && (
          <DropdownMenuItem 
            onClick={onEdit}
            className="text-luxury-neutral hover:text-white"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={onDelete} className="text-red-400 hover:text-red-300">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
